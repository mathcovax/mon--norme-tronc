import { PipelineStage } from "mongoose";
import { SearchService } from "./search";

describe("search service", () => {
	it("search with category", () => {
		const categoryName = "test";
		const search = undefined;
		const sort = false;
		const searchByRegex = undefined;
		const searchs = SearchService.makePipelinesStage({ categoryName, search, searchByRegex }, sort);

		expect(searchs).toEqual([{ $match: { categories: categoryName } }]);

	});

	it("search with search", () => {
		const categoryName = undefined;
		const search = "test";
		const sort = false;
		const searchByRegex = undefined;
		const searchs = SearchService.makePipelinesStage({ categoryName, search, searchByRegex }, sort);

		expect(searchs).toEqual([{ $match: { $text: { $search: search } } }]);
	});

	it("search with search and sort", () => {
		const categoryName = undefined;
		const search = "test";
		const sort = true;
		const searchByRegex = undefined;
		const searchs = SearchService.makePipelinesStage({ categoryName, search, searchByRegex }, sort);

		expect(searchs).toEqual([
			{ $match: { $text: { $search: search } } },
			{ $sort: { score: { $meta: "textScore" }, posts: -1 } }
		]);
	});

	it("search with searchByRegex", () => {
		const categoryName = undefined;
		const search = undefined;
		const sort = false;
		const searchByRegex = "test";
		const searchs = SearchService.makePipelinesStage({ categoryName, search, searchByRegex }, sort);

		expect(searchs).toEqual([
			{
				$match: {
					$or: SearchService.indexes.map(value => ({
						[value]: {
							$regex: new RegExp(searchByRegex, "i")
						}
					}))
				}
			}
		]);
	});

	it("search with searchByRegex and sort", () => {
		const categoryName = undefined;
		const search = undefined;
		const sort = true;
		const searchByRegex = "test";
		const searchs = SearchService.makePipelinesStage({ categoryName, search, searchByRegex }, sort);

		expect(searchs).toEqual([
			{
				$addFields: SearchService.indexes.reduce<PipelineStage.AddFields["$addFields"]>(
					(pv, cv) => {
						pv[`match-${cv}`] = {
							$cond: {
								if: {
									$regexMatch: {
										input: `$${cv}`,
										regex: new RegExp(searchByRegex, "i")
									}
								},
								then: 1,
								else: 0
							}
						};
						return pv;
					},
					{}
				)
			},
			{
				$match: {
					$or: SearchService.indexes.map(value => ({
						[`match-${value}`]: {
							$eq: 1
						}
					}))
				},
			},
			{
				$sort: SearchService.indexes.reduce<PipelineStage.Sort["$sort"]>(
					(pv, cv) => {
						pv[`match-${cv}`] = -1;
						return pv;
					},
					{}
				)
			},
			{
				$project: SearchService.indexes.reduce<PipelineStage.Project["$project"]>(
					(pv, cv) => {
						pv[`match-${cv}`] = 0;
						return pv;
					},
					{}
				)
			}
		]);
	});
});
