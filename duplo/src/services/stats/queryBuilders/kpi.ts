import type { FilterTopSchema, FilterValueSchema } from "@schemas/gridStatCommand";
import type { PipelineStage } from "mongoose";

class PipelineStageBuilderKpi {

	private query: PipelineStage[];

	constructor(organizationId: string) {
		this.query = [{ $match: { "organization.id": organizationId } }];
	}

	buildPipelineStageForTop(filters: FilterTopSchema): PipelineStage[] {
		const { startDate, endDate, customfilterType, filterValue } = filters;

		const stage: PipelineStage[] = [{ $match: { "dayOfYear": { $gte: startDate, $lte: endDate } } },];
		if (customfilterType === "categories") {
			stage.push(
				{ $match: { "productSheet.categories": { $in: filterValue } } },
				{ $unwind: "$productSheet.categories" },
				{ 
					$group: { 
						_id: "$productSheet.categories", 
						total: { $sum: "$totalValue" },
						key: { $first: "$productSheet.categories" } 
					} 
				},
				{ $sort: { total: -1 } },
				{
					$project: {
						_id: 0,
						key: 1,
						total: 1,
					}
				}
			);

			this.query.push(...stage);
		} else if (customfilterType === "productSheetsId") {
			stage.push(
				{ $match: { "productSheet.id": { $in: filterValue } } },
				{ 
					$group: { 
						_id: "$productSheet.id", 
						total: { $sum: "$totalValue" },
						key: { $first: "$productSheet.name" } 
					} 
				},
				{ $sort: { total: -1 } },
				{
					$project: {
						_id: 0,
						key: 1,
						total: 1,
					}
				}
			);

			this.query.push(...stage);
		}
		return this.query;
	}

	buildPipelineStageForValue(filters: FilterValueSchema): PipelineStage[] {
		const { startDate, endDate, customfilterType, filterValue } = filters;

		const stage: PipelineStage[] = [{ $match: { "dayOfYear": { $gte: startDate, $lte: endDate } } },];
		if (customfilterType === "category") {
			stage.push(
				{ $match: { "productSheet.categories": filterValue } },
				{ $unwind: "$productSheet.categories" },
				{ 
					$group: { 
						_id: "$productSheet.categories", 
						total: { $sum: "$totalValue" },
						key: { $first: "$productSheet.categories" } 
					} 
				},
				{ $sort: { total: -1 } },
				{
					$project: {
						_id: 0,
						key: 1,
						total: 1,
					}
				}
			);

			this.query.push(...stage);
		} else if (customfilterType === "productSheetId") {
			stage.push(
				{ $match: { "productSheet.id": filterValue } },
				{ 
					$group: { 
						_id: "$productSheet.id", 
						total: { $sum: "$totalValue" },
						key: { $first: "$productSheet.name" } 
					} 
				},
				{ $sort: { total: -1 } },
				{
					$project: {
						_id: 0,
						key: 1,
						total: 1,
					}
				}
			);

			this.query.push(...stage);
		}

		return this.query;
	}
}
export default PipelineStageBuilderKpi;
