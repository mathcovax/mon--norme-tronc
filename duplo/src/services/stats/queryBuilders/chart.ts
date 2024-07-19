import type { FilterCategoriesFacetsSchema, FilterProductSheetSchema } from "@schemas/gridStatCommand";
import { PipelineStage } from "mongoose";
import { roundDate } from "@utils/roundDate";

class PipelineStageBuilderChart {
	private organizationId: string;
	private queries: PipelineStage[][] = [];

	constructor(organizationId: string) {
		this.organizationId = organizationId;
	}

	public buildPipelineStageForCategoriesFacets(filters: FilterCategoriesFacetsSchema): PipelineStage[][] {
		const { startDate, endDate, priceMax, priceMin, categories, facets } = filters;

		if (categories) {
			for (const category of categories) {
				const facetNames: string[] = [];
				const categoryStages: PipelineStage[] = [
					{ $match: { "organization.id": this.organizationId } },
					{ $match: { "productSheet.categories": { $in: [category] } } },
					{ $match: { "dayOfYear": { $gte: startDate, $lte: endDate } } }
				];
				if (facets) {
					for (const [key, value] of Object.entries(facets)) {
						if (value !== undefined) {
							facetNames.push(`${key}_${value}`);
							categoryStages.push({ $match: { [`productSheet.facets.${key}`]: value } });
						}
					}
				}
				if (priceMax) categoryStages.push({ $match: { "productSheet.price": { $lte: priceMax } } });
				if (priceMin) categoryStages.push({ $match: { "productSheet.price": { $gte: priceMin } } });
		
				categoryStages.push(
					{
						$group: {
							_id: {
								dayOfYear: "$dayOfYear",
								category: "$productSheet.categories"
							},
							totalValue: { $sum: "$totalValue" } ,
							quantity: { $sum: "$productQuantity" },
							priceUnit: { $first: "$productSheet.price" },
							name: { $first: { $concat: [category, "_", { $reduce: { input: facetNames, initialValue: "", in: { $concat: ["$$value", "$$this"] } } }] } },
							dayOfYear: { $first: "$dayOfYear" }
						}
					},
					{
						$addFields: {
							dayOfYear: { $toDate: "$_id.dayOfYear" }
						}
					},
					{
						$sort: { "dayOfYear": 1 }
					},
					{
						$densify: {
							field: "dayOfYear",
							range: {
								step: 1,
								unit: "day",
								bounds: [roundDate(startDate), roundDate(endDate)]
							}
						}
					},
					{
						$addFields: {
							totalValue: { $ifNull: ["$totalValue", 0] },
							quantity: { $ifNull: ["$quantity", 0] },
							priceUnit: { $ifNull: ["$priceUnit", 0] },
							name: {
								$ifNull: [
									"$name",
									{ $concat: [category, "_", { $reduce: { input: facetNames, initialValue: "", in: { $concat: ["$$value", "$$this"] } } }] }
								]
							}
						}
					},
					{
						$project: {
							_id: 0,
							dayOfYear: 1,
							totalValue: 1,
							quantity: 1,
							priceUnit: 1,
							name: 1
						}
					},
				);
				
		
				this.queries.push(categoryStages);
			}
		} else if (facets && !categories) {
			const facetsStages: PipelineStage[] = [
				{ $match: { "organization.id": this.organizationId } },
				{ $match: { "dayOfYear": { $gte: startDate, $lte: endDate } } }
			];
			const facetNames: string[] = [];
			for (const [key, value] of Object.entries(facets)) {
				if (value !== undefined) {
					facetNames.push(`${key}_${value}`);
					facetsStages.push({ $match: { [`productSheet.facets.${key}`]: value } });
				}
			}
			if (priceMax) facetsStages.push({ $match: { "productSheet.price": { $lte: priceMax } } });
			if (priceMin) facetsStages.push({ $match: { "productSheet.price": { $gte: priceMin } } });

			facetsStages.push(
				{
					$group: {
						_id: { dayOfYear: "$dayOfYear" },
						totalValue: { $sum: "$totalValue" } ,
						quantity: { $sum: "$productQuantity" },
						priceUnit: { $first: "$productSheet.price" },
						name: {
							$first: {
								$reduce: {
									input: facetNames,
									initialValue: "",
									in: { $concat: ["$$value", { $cond: { if: { $eq: ["$$value", ""] }, then: "", else: "_" } }, "$$this"] }
								}
							}
						},
						dayOfYear: { $first: "$dayOfYear" }
					}
				},
				{
					$addFields: {
						dayOfYear: { $toDate: "$_id.dayOfYear" }
					}
				},
				{
					$sort: { "dayOfYear": 1 }
				},
				{
					$densify: {
						field: "dayOfYear",
						range: {
							step: 1,
							unit: "day",
							bounds: [roundDate(startDate), roundDate(endDate)]
						}
					}
				},
				{
					$addFields: {
						totalValue: { $ifNull: ["$totalValue", 0] },
						quantity: { $ifNull: ["$quantity", 0] },
						priceUnit: { $ifNull: ["$priceUnit", 0] },
						name: {
							$ifNull: [
								"$name", { 
									$reduce: {
										input: facetNames,
										initialValue: "",
										in: { $concat: ["$$value", { $cond: { if: { $eq: ["$$value", ""] }, then: "", else: "_" } }, "$$this"] }
									}
								}
							]
						}
					}
				},
				{
					$project: {
						_id: 0,
						dayOfYear: 1,
						totalValue: 1,
						quantity: 1,
						priceUnit: 1,
						name: 1
					}
				}
			);

			this.queries.push(facetsStages);
		}

		return this.queries;
	}

	public buildPipelineStageForProductSheet(filters: FilterProductSheetSchema): PipelineStage[][] {
		const { startDate, endDate, priceMax, priceMin, productSheetsId } = filters;

		for (const productSheetId of productSheetsId) {
			const productSheetStages: PipelineStage[] = [
				{ $match: { "organization.id": this.organizationId } },
				{ $match: { "productSheet.id": productSheetId } },
				{ $match: { "dayOfYear": { $gte: startDate, $lte: endDate } } }
			];
			if (priceMax) productSheetStages.push({ $match: { "productSheet.price": { $lte: priceMax } } });
			if (priceMin) productSheetStages.push({ $match: { "productSheet.price": { $gte: priceMin } } });

			productSheetStages.push(
				{
					$group: {
						_id: {
							dayOfYear: "$dayOfYear",
							productSheet: "$productSheet.id"
						},
						totalValue: { $sum: "$totalValue" } ,
						quantity: { $sum: "$productQuantity" },
						priceUnit: { $first: "$productSheet.price" },
						name: { $first: "$productSheet.name" },
						dayOfYear: { $first: "$dayOfYear" }
					}
				},
				{
					$addFields: {
						dayOfYear: { $toDate: "$_id.dayOfYear" }
					}
				},
				{
					$sort: { "dayOfYear": 1 }
				},
				{
					$densify: {
						field: "dayOfYear",
						range: {
							step: 1,
							unit: "day",
							bounds: [roundDate(startDate), roundDate(endDate)]
						}
					}
				},
				{
					$addFields: {
						totalValue: { $ifNull: ["$totalValue", 0] },
						quantity: { $ifNull: ["$quantity", 0] },
						priceUnit: { $ifNull: ["$priceUnit", 0] },
						name: { $ifNull: ["$name", ""] }
					}
				},
				{
					$project: {
						_id: 0,
						dayOfYear: 1,
						totalValue: 1,
						quantity: 1,
						priceUnit: 1,
						name: 1
					}
				}
			);

			this.queries.push(productSheetStages);
		}
		return this.queries;
	}
}

export default PipelineStageBuilderChart;
