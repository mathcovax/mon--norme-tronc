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

		const diffDays = endDate.getTime() - startDate.getTime() / (1000 * 60 * 60 * 24);

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

				if (diffDays <= 20) {
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
								dayOfYear: { $toDate: "$_id.dayOfYear" },
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
									bounds: [roundDate(startDate, 1), roundDate(endDate, 1)]
								}
							}
						},
					);
				} else if (diffDays > 20 && diffDays <= 61) {
					categoryStages.push(
						{
							$group: {
								_id: {
									week: { $week: "$dayOfYear" },
									year: { $year: "$dayOfYear" },
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
								dayOfYear: { $dateFromParts: { isoWeekYear: "$_id.year", isoWeek: "$_id.week" } }
							}
						},
						{
							$sort: { "_id.week": 1, "_id.year": 1 }
						},
						{
							$densify: {
								field: "dayOfYear",
								range: {
									step: 1,
									unit: "week",
									bounds: [roundDate(startDate, 0), roundDate(endDate, 0)]
								}
							}
						},
					);
				} else {
					categoryStages.push(
						{
							$group: {
								_id: {
									month: { $month: "$dayOfYear" },
									year: { $year: "$dayOfYear" },
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
								dayOfYear: { $dateFromParts: { year: "$_id.year", month: "$_id.month" } }
							}
						},
						{
							$sort: { "_id.month": 1, "_id.year": 1 }
						},
						{
							$densify: {
								field: "dayOfYear",
								range: {
									step: 1,
									unit: "month",
									bounds: [roundDate(startDate, 0), roundDate(endDate, 0)]
								}
							}
						},
					);
				}
		
				categoryStages.push(
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

			if (diffDays <= 14) {
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
								bounds: [roundDate(startDate, 1), roundDate(endDate, 1)]
							}
						}
					},
				);
			} else if (diffDays > 14 && diffDays <= 61) {
				facetsStages.push(
					{
						$group: {
							_id: {
								week: { $week: "$dayOfYear" },
								year: { $year: "$dayOfYear" },
							},
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
							dayOfYear: { $dateFromParts: { isoWeekYear: "$_id.year", isoWeek: "$_id.week" } }
						}
					},
					{
						$sort: { "_id.week": 1, "_id.year": 1 }
					},
					{
						$densify: {
							field: "dayOfYear",
							range: {
								step: 1,
								unit: "week",
								bounds: [roundDate(startDate, 0), roundDate(endDate, 0)]
							}
						}
					},
				);
			} else {
				facetsStages.push(
					{
						$group: {
							_id: {
								month: { $month: "$dayOfYear" },
								year: { $year: "$dayOfYear" },
							},
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
							dayOfYear: { $dateFromParts: { year: "$_id.year", month: "$_id.month" } }
						}
					},
					{
						$sort: { "_id.month": 1, "_id.year": 1 }
					},
					{
						$densify: {
							field: "dayOfYear",
							range: {
								step: 1,
								unit: "month",
								bounds: [roundDate(startDate, 0), roundDate(endDate, 0)]
							}
						}
					},
				);
			}

			facetsStages.push(
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

		const diffDays = endDate.getTime() - startDate.getTime() / (1000 * 60 * 60 * 24);

		for (const productSheetId of productSheetsId) {
			const productSheetStages: PipelineStage[] = [
				{ $match: { "organization.id": this.organizationId } },
				{ $match: { "productSheet.id": productSheetId } },
				{ $match: { "dayOfYear": { $gte: startDate, $lte: endDate } } }
			];
			if (priceMax) productSheetStages.push({ $match: { "productSheet.price": { $lte: priceMax } } });
			if (priceMin) productSheetStages.push({ $match: { "productSheet.price": { $gte: priceMin } } });
			
			if (diffDays <= 14) {
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
								bounds: [roundDate(startDate, 1), roundDate(endDate, 1)]
							}
						}
					},
				);
			} else if (diffDays > 14 && diffDays <= 61) {
				productSheetStages.push(
					{
						$group: {
							_id: {
								week: { $week: "$dayOfYear" },
								year: { $year: "$dayOfYear" },
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
							dayOfYear: { $dateFromParts: { isoWeekYear: "$_id.year", isoWeek: "$_id.week" } }
						}
					},
					{
						$sort: { "_id.week": 1, "_id.year": 1 }
					},
					{
						$densify: {
							field: "dayOfYear",
							range: {
								step: 1,
								unit: "week",
								bounds: [roundDate(startDate, 0), roundDate(endDate, 0)]
							}
						}
					},
				);
			} else {
				productSheetStages.push(
					{
						$group: {
							_id: {
								month: { $month: "$dayOfYear" },
								year: { $year: "$dayOfYear" },
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
							dayOfYear: { $dateFromParts: { year: "$_id.year", month: "$_id.month" } }
						}
					},
					{
						$sort: { "_id.month": 1, "_id.year": 1 }
					},
					{
						$densify: {
							field: "dayOfYear",
							range: {
								step: 1,
								unit: "month",
								bounds: [roundDate(startDate, 0), roundDate(endDate, 0)]
							}
						}
					},
				);
			}

			productSheetStages.push(
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
