import "./setup";
import { FindSlice } from "@utils/findSlice";
import { mongoose } from "./setup/mongoose";
import { fullProductSheetModel } from "@mongoose/model";
import { FullProductSheetSchema } from "@schemas/fullProductSheet";
import { facetTypeTuple } from "@schemas/facet";
import { facet_type } from "@prisma/client";
import { LastTime } from "./setup/lastTime";
import { PromiseList } from "./setup/promiseList";

const newLastIndexing = new Date();
const lastTime = new LastTime("indexingProductSheet");
const lastIndexing = await lastTime.get();

const productSheetGenerator = FindSlice(
	500, 
	(slice, size) => prisma.product_sheet.findMany({
		where: {
			organization: {
				suspended: false
			},
			status: {
				not: "REMOVE"
			},
			updatedAt: {
				gte: lastIndexing
			},
		},
		include: {
			organization: {
				select: {
					name: true,
					label: true,
					logoUrl: true,
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
				}
			},
			promotions: {
				where: {
					startDate: {
						lte: newLastIndexing
					},
					endDate: {
						gte: newLastIndexing
					}
				},
				select: {
					percentage: true,
					startDate: true,
					endDate: true
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
	if (productSheet.images.length === 0) {
		continue;
	}

	const fullProductSheet: FullProductSheetSchema = {
		id: productSheet.id,
		name: productSheet.name,
		description: productSheet.description,
		shortDescription: productSheet.shortDescription,
		price: productSheet.price,
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
		)
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
await lastTime.set(newLastIndexing);

await fullProductSheetModel.updateMany(
	{
		"promotion.endDate": {
			$lte: newLastIndexing
		},	
	},
	{
		$unset: {
			promotion: true,
			hasPromotion: true,
		} 
	}
);

const promotionGenerator = FindSlice(
	500,
	(slice, size) => {
		const part = prisma.promotion.groupBy({
			by: ["productSheetId"],
			where: {
				startDate: {
					lte: newLastIndexing
				},
				endDate: {
					gte: newLastIndexing
				}
			},
			_max: {
				startDate: true
			},
			orderBy: {
				productSheetId: "asc"
			},
			take: size,
			skip: slice * size
		});

		return part;
	}
);

for await (const promotion of promotionGenerator) {
	if (!promotion._max.startDate) {
		continue;
	}

	await promiseList.append(
		prisma.promotion.findFirstOrThrow({
			where: {
				productSheetId: promotion.productSheetId,
				startDate: promotion._max.startDate
			},
			include: {
				productSheet: {
					select: {
						price: true,
					}
				}
			}
		}).then(
			promotion => fullProductSheetModel.updateOne(
				{ id: promotion.productSheetId },
				{
					$set: {
						hasPromotion: true,
						promotion: {
							id: promotion.id,
							originalPrice: promotion.productSheet.price,
							percentage: promotion.percentage,
							startDate: promotion.startDate,
							endDate: promotion.endDate,
						} satisfies FullProductSheetSchema["promotion"],
						price: Number(
							(promotion.productSheet.price * promotion.percentage / 100).toFixed(2)
						),
					}
				}
			)
		)
	);
}

await promiseList.clear();

mongoose.connection.close();

