import { categoryExistCheck } from "@checkers/category";
import { fullProductSheetModel } from "@mongoose/model";
import { fullProductSheetSchema } from "@schemas/fullProductSheet";
import { FilterService } from "@services/filter";
import { SearchService } from "@services/search";
import { stringBoolean, zodToArray } from "@utils/zod";

/* METHOD : GET, PATH : /full-product-sheets */
export const GET = (method: Methods, path: string) => 
	duplo
		.declareRoute(method, path)
		.extract({
			query: zod.object({
				ignoreProductSheetId: zodToArray(zod.string()).optional(),
				available: stringBoolean.optional(),
				page: zod.coerce.number().default(1).transform(v => v < 1 ? 0 : v - 1),
				take: zod.coerce.number().min(1).max(40).default(40),
			})
				.and(FilterService.filtersQuerySchema)
				.and(SearchService.searchQuerySchema)
				.default({})
		})
		.check(
			categoryExistCheck,
			{
				input: p => p("query").categoryName ?? "",
				...categoryExistCheck.preCompletions.mustExist,
				skip: p => p("query").categoryName == undefined,
			},
			new IHaveSentThis(NotFoundHttpException.code, "category.notfound")
		)
		.cut(
			({ pickup }) => {
				const category = pickup("category");

				if (category && category.disabled) {
					throw new ForbiddenHttpException("category.disabled");
				}

				return {};
			},
			[],
			new IHaveSentThis(ForbiddenHttpException.code, "category.disabled")
		)
		.handler(
			async ({ pickup }) => {
				const { available, ignoreProductSheetId, page, take, categoryName, search, searchByRegex, ...filtersValue } = pickup("query");
				const filters = FilterService.makePipelinesStage(filtersValue);
				const searchs = SearchService.makePipelinesStage({ categoryName, search, searchByRegex });
				
				const fullProductSheets = await fullProductSheetModel.aggregate([
					...searchs,
					...filters,
					...(available ? [{ $match: { quantity: { $gt: 0 } } }] : []),
					...(ignoreProductSheetId
						? [{ $match: { id: { $nin: ignoreProductSheetId } } }]
						: []
					),
					{ $skip: page * take },
					{ $limit: take },
				]);

				throw new OkHttpException("fullProductSheets", fullProductSheets);
			},
			new IHaveSentThis(OkHttpException.code, "fullProductSheets", fullProductSheetSchema.array())
		);
