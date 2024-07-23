import { fullProductSheetModel } from "@mongoose/model";
import { FilterService } from "@services/filter";
import { SearchService } from "@services/search";
import { productSheetsQuantityComputedPiplineStageByFiltersDefs } from "@utils/mongoose/productSheetsQuantityComputedPiplineStageByFiltersDefs";

/* METHOD : GET, PATH : /full-product-sheets-count */
export const GET = (method: Methods, path: string) => 
	duplo
		.declareRoute(method, path)
		.extract({
			query: zod.object({})
				.and(FilterService.filtersQuerySchema)
				.and(SearchService.searchQuerySchema)
				.default({})
		})
		.handler(
			async ({ pickup }) => {
				const { categoryName, search, searchByRegex, ...filtersValue } = pickup("query");
				const pipelinesStages = FilterService.makePipelinesStage(filtersValue);
				const searchs = SearchService.makePipelinesStage({ categoryName, search, searchByRegex }, false);

				const [result] = await fullProductSheetModel.aggregate<{count?: number} | undefined>([
					...searchs,
					...pipelinesStages,
					productSheetsQuantityComputedPiplineStageByFiltersDefs[0],
					{ $count: "count" }
				]);

				if (!result || result.count === undefined) {
					throw new Error("Missign count");
				}
				else {
					result.count--;
				} 

				throw new OkHttpException(
					"fullProductSheetCount", 
					{ fullProductSheetCount: result.count.toString() }
				);
			},
			new IHaveSentThis(
				OkHttpException.code, 
				"fullProductSheetCount", 
				zod.object({ fullProductSheetCount: zod.string() })
			)
		);
