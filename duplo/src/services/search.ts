import { PipelineStage } from "mongoose";

export class SearchService {
	static searchQuerySchema = zod.object({
		search: zod.string().optional(),
		searchByRegex: zod.string().regex(/^[A-zÀ-ÿ0-9_\- ']+$/).optional().catch(undefined),
		categoryName: zod.string().optional(),
	});

	static indexes = [
		"name", "shortDescription", "description", "ref"
	];

	static makePipelinesStage(
		{
			categoryName, 
			search,
			searchByRegex
		}: Zod.infer<typeof SearchService.searchQuerySchema>,
		sort = true,
	) {
		const pipelines: PipelineStage[] = [];
		
		if (categoryName !== undefined) {
			pipelines.push({ $match: { categories: categoryName } });
		}

		if (search !== undefined) {
			pipelines.push({ 
				$match: { 
					$text: { $search: search } 
				} 
			});

			if (sort) {
				pipelines.push({ 
					$sort: { score: { $meta: "textScore" }, posts: -1 } 
				});
			}
		}

		if (searchByRegex !== undefined) {
			if (sort) {
				pipelines.push(
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
				);
			}
			else {
				pipelines.push({
					$match: {
						$or: SearchService.indexes.map(value => ({
							[value]: {
								$regex: new RegExp(searchByRegex, "i")
							}
						}))
					},
				});
			}
		}

		return pipelines;
	}
}
