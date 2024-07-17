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

	const [groupReview] = await productSheetReviewModel.aggregate<{avgRate?: number} | undefined>([
		{ $match: { productSheetId: productSheet.id } },
		{
			$group: {
				_id: "$productSheetId",
				avgRate: {
					$avg: "$rate"
				}
			}
		},
	]);

	const promotion = productSheet.promotions[0];

	const fullProductSheet: FullProductSheetSchema = {
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
		status: productSheet.status,
	};

	await promiseList.append(
		fullProductSheetModel.findOneAndUpdate(
			{ id: productSheet.id }, 
			fullProductSheet, 
			{ new: true, upsert: true }
		)
	);
}

await promiseList.clear();

mongoose.connection.close();

console.log("finish indexing:product");


