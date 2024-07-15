import ZodAccelerator from "@duplojs/zod-accelerator";
import { contract } from "@utils/contract";
import { zodToArray } from "@utils/zod";
import { FilterQuery, PipelineStage } from "mongoose";

export class FilterService {
	static makePipelinesStage(
		filtersValues: Zod.infer<typeof FilterService.filtersQuerySchema>, 
		keepNull: true
	): (PipelineStage | null)[]
	static makePipelinesStage(
		filtersValues: Zod.infer<typeof FilterService.filtersQuerySchema>
	): PipelineStage[]
	static makePipelinesStage(
		filtersValues: Zod.infer<typeof FilterService.filtersQuerySchema>,
		keepNull?: boolean,
	) {
		const pipelines = filterDefs.map<PipelineStage | null>(
			(filterDef) => {
				const filterValue = filtersValues[filterDef.name];

				if (filterDef.type === "CHECKBOX") {
					const result = FilterService.filtersValueSchema[filterDef.type]
						.accelerator?.safeParse(filterValue);

					if (result?.success) {
						return {
							$match: {
								$and: result.data.map<FilterQuery<unknown>>(value => ({
									[filterDef.path]: { $regex: new RegExp(value, "i") }
								}))
							},
						};
					}
				}
				else if (filterDef.type === "RADIO") {
					const result = FilterService.filtersValueSchema[filterDef.type]
						.accelerator?.safeParse(filterValue);

					if (result?.success) {
						return {
							$match: {
								[filterDef.path]: { $regex: new RegExp(`^${result.data}$`, "i") }
							},
						};
					}
				}
				else if (filterDef.type === "TOGGLE") {
					const result = FilterService.filtersValueSchema[filterDef.type]
						.accelerator?.safeParse(filterValue);

					if (result?.success && result.data) {
						return {
							$match: { [filterDef.path]: filterDef.trueValue ?? true }
						};
					}
				}
				else if (filterDef.type === "RANGE") {
					const result = FilterService.filtersValueSchema[filterDef.type]
						.accelerator?.safeParse(filterValue);

					if (result?.success) {
						return {
							$match: {
								[filterDef.path]: {
									$gte: result.data[0],
									$lte: result.data[1]
								}
							}
						};
					}
				}

				return null;
			}
		);

		if (keepNull) {
			return pipelines;
		}
		else {
			return pipelines.filter((v): v is PipelineStage => !!v);
		}
	}

	static get filtersQuerySchema() {
		return zod.object(
			filterDefs.reduce(
				(pv, cv) => ({ 
					...pv, 
					[cv.name]: FilterService.filtersValueSchema[cv.type].optional() 
				}),
				{} as {
					[F in typeof filterDefs[number] as F["name"]]: 
						Zod.ZodOptional<typeof FilterService["filtersValueSchema"][F["type"]]>
				}
			)
		);
	}

	static filtersValueSchema = contract<{[P in FilterDef["type"]]: Zod.ZodType}>()({
		CHECKBOX: zodToArray(zod.string()),
		RADIO: zod.string(),
		TOGGLE: zod.any().transform(value => !!value),
		RANGE: zod.tuple([zod.coerce.number(), zod.coerce.number()]),
	});

	static {
		Object.values(FilterService.filtersValueSchema).forEach(
			zodSchema => ZodAccelerator.build(zodSchema)
		);
	}
}
