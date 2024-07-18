import "./setup";
import { FindSlice } from "@utils/findSlice";
import { mongoose } from "./setup/mongoose";
import { fullProductSheetModel, productSheetReviewModel } from "@mongoose/model";
import { FullProductSheetSchema } from "@schemas/fullProductSheet";
import { facetTypeTuple } from "@schemas/facet";
import { facet_type } from "@prisma/client";
import { PromiseList } from "./setup/promiseList";
import { formatPrice } from "@utils/formatPrice";

const currentDate = new Date();

const productSheetGenerator = FindSlice(
	500, 
	(slice, size) => prisma.product_sheet.findMany({
		include: {
			organization: {
				select: {
					name: true,
					label: true,
					logoUrl: true,
					suspended: true,
				}
			},
			facets: {
				select: {
					type: true,
					value: true,
				}
			},
			images: {
				select: {
					url: true
				},
				orderBy: {
					id: "desc",
				}
			},
			promotions: {
				where: {
					startDate: {
						lte: currentDate
					},
					endDate: {
						gte: currentDate
					}
				},
				orderBy: {
					startDate: "desc",
				},
				take: 1,
			},
			categories: {
				select: {
					categoryName: true
				}
			},
			_count: {
				select: {
					products: {
						where: {
							status: "IN_STOCK"
						}
					}
				}
			}
		},
		take: size,
		skip: slice * size
	})
);

const promiseList = new PromiseList(1000);

for await (const productSheet of productSheetGenerator) {
	if (
		productSheet.images.length === 0 ||
		productSheet.organization.suspended === true ||
		productSheet.status === "REMOVE"
	) {
		await promiseList.append(
			fullProductSheetModel.deleteOne(
				{ id: productSheet.id }
			)
		);
		continue;
	}
	
	await promiseList.append(
		productSheetReviewModel.aggregate<{avgRate?: number, countRate?: number} | undefined>([
			{ $match: { productSheetId: productSheet.id } },
			{
				$group: {
					_id: "$productSheetId",
					avgRate: {
						$avg: "$rate"
					},
					countRate: {
						$count: {}
					},
				}
			},
		]).then(([groupReview]): FullProductSheetSchema => {
			const promotion = productSheet.promotions[0];

			return {
				id: productSheet.id,
				ref: productSheet.ref,
				name: productSheet.name,
				description: productSheet.description,
				shortDescription: productSheet.shortDescription,
				price: promotion 
					? formatPrice(productSheet.price - (productSheet.price * promotion.percentage / 100))
					: productSheet.price,
				quantity: productSheet._count.products,
				categories: productSheet.categories.map(c => c.categoryName),
				images: productSheet.images.map(i => i.url),
				organization: {
					id: productSheet.organizationId,
					name: productSheet.organization.name,
					label: productSheet.organization.label ?? undefined,
					logoUrl: productSheet.organization.logoUrl ?? undefined
				},
				facets: facetTypeTuple.reduce(
					(pv, ft) => ({
						...pv, 
						[ft]: productSheet.facets.find(f => f.type === ft)?.value
					}),
				{} as { [P in facet_type]?: string}
				),
				hasPromotion: !!promotion,
				promotion: promotion 
					? {
						id: promotion.id,
						originalPrice: productSheet.price,
						percentage: promotion.percentage,
						startDate: promotion.startDate,
						endDate: promotion.endDate,
						reason: promotion.reason,
					}
					: undefined,
				avgRate: Math.round(groupReview?.avgRate ?? -1).toString(),
				countRate: groupReview?.countRate ?? 0,
				status: productSheet.status,
				variationGroup: productSheet.variationGroup ?? undefined,
				variationName: productSheet.variationName ?? undefined,
			};
		}).then(
			fullProductSheet => fullProductSheetModel.findOneAndUpdate(
				{ id: productSheet.id }, 
				fullProductSheet, 
				{ new: true, upsert: true }
			)
		)
	);
}

await promiseList.clear();

const fullProductSheetGenerator = FindSlice(
	500,
	(slice, size) => fullProductSheetModel.aggregate<FullProductSheetSchema>([
		{ 
			$match: { 
				variationGroup: { $exists: true }, 
				variationName: { $exists: true }, 
			} 
		},
		{ $skip: slice * size },
		{ $limit: size }
	])
);

for await (const fullProductSheet of fullProductSheetGenerator) {
	if (
		!fullProductSheet.variationGroup || 
		!fullProductSheet.variationName
	) {
		continue;
	}
	
	await promiseList.append(
		fullProductSheetModel.aggregate<FullProductSheetSchema>([
			{ 
				$match: {
					"organization.id": fullProductSheet.organization.id,
					variationGroup: fullProductSheet.variationGroup, 
					variationName: { $exists: true }, 
				} 
			},
		]).then((fullProductSheets) => fullProductSheetModel.updateOne(
			{ id: fullProductSheet.id },
			{
				$set: {
					variations: fullProductSheets.map(fps => ({
						firstImageUrl: fps.images[0] ?? "",
						name: fps.variationName ?? "",
						productSheetId: fps.id,
					})) satisfies FullProductSheetSchema["variations"]
				}
			}
		))
	);
}

await promiseList.clear();

mongoose.connection.close();

console.log("finish indexing:product");


