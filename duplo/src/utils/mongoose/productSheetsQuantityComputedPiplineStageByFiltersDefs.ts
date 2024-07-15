import { transform } from "@utils/transform";
import { PipelineStage } from "mongoose";

export const productSheetsQuantityComputedPiplineStageByFiltersDefs = transform(
	filterDefs.reduce<
		PipelineStage.Project 
		& PipelineStage.Group 
		& PipelineStage.Densify
	>(
		(pv, filterDef) => {
			if (filterDef.type === "CHECKBOX" || filterDef.type === "RADIO") {
				filterDef.values.forEach(value => {
					pv.$project[`${filterDef.name}.${value}`] = {
						$cond: {
							if: {
								$regexMatch: { 
									input: `$${filterDef.path}`, 
									regex: new RegExp(filterDef.type === "CHECKBOX" ? value :`^${value}$`, "i")
								}
							},
							then: 1,
							else: 0
						}
					};

					pv.$group = {
						...pv.$group,
						[`${filterDef.name}\\${value}`]: { $sum: `$${filterDef.name}.${value}` }
					};
				});
			}
			else if (filterDef.type === "RANGE") {
				pv.$project[`${filterDef.name}.quantity`] = {
					$cond: {
						if: {
							$not: {
								$eq: ["$default", 1]
							},
						},
						then: 1,
						else: 0
					}
				};

				pv.$project[`${filterDef.name}.number`] = `$${filterDef.path}`;

				pv.$group = {
					...pv.$group,
					[`${filterDef.name}\\max`]: { $max: `$${filterDef.name}.number` },
					[`${filterDef.name}\\min`]: { $min: `$${filterDef.name}.number` },
				};
			}
			else if (filterDef.type === "TOGGLE") {
				pv.$project[`${filterDef.name}`] = {
					$cond: {
						if: {
							$eq: [`$${filterDef.path}`, filterDef.trueValue ?? true]
						},
						then: 1,
						else: 0
					}
				};

				pv.$group = {
					...pv.$group,
					[`${filterDef.name}`]: { $sum: `$${filterDef.name}` }
				};
			}

			return pv;
		},
		{
			$project: {},
			$group: { _id: null },
			$densify: {
				field: "default",
				range: {
					step: 1,
					bounds: [1, 1]
				}
			},

		}
	),
	({ $densify, $project, $group }) => [{ $densify }, { $project }, { $group }] as const
);
