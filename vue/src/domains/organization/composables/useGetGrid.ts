import type { WidgetStat, WidgetResult } from "@/lib/utils";

interface WidgetStatWithRules extends WidgetStat {
	"min-h": number;
	"max-h": number;
	"min-w": number;
	"max-w": number;
}

export type WidgetFull = WidgetStatWithRules & WidgetResult;

const ruleWidgetDimensions = {
	"bar": {
		"min-h": 3, "max-h": 6, "min-w": 4, "max-w": 6 
	},
	"line": {
		"min-h": 3, "max-h": 6, "min-w": 4, "max-w": 6 
	},
	"pie": {
		"min-h": 1, "max-h": 6, "min-w": 2, "max-w": 6 
	},
	"donut": {
		"min-h": 1, "max-h": 6, "min-w": 2, "max-w": 6 
	},
	"area": {
		"min-h": 3, "max-h": 6, "min-w": 4, "max-w": 6 
	},
	"top": {
		"min-h": 3, "max-h": 6, "min-w": 4, "max-w": 6 
	},
	"value": {
		"min-h": 1, "max-h": 6, "min-w": 3, "max-w": 6 
	},
};

export function useGetGrid(organizationId: string) {
	const gridStat = ref<WidgetFull[]>([]);
	const gridStructure = ref<WidgetStat[]>([]);

	async function getGrid() {
		const data = await duploTo.enriched
			.get(
				"/organization/{organizationId}/grid", 
				{ params: { organizationId } }
			)
			.id("gridStatCommand.found");

		gridStructure.value = data;
		gridStat.value = await Promise.all(
			data.map(
				(widget) => 
					duploTo.enriched
						.post(
							"/organization/{organizationId}/make-stat",
							widget.params,
							{ params: { organizationId } }
						)
						.id("widget.found")
						.then(resultData => ({
							...widget, 
							...ruleWidgetDimensions[widget.params.type],
							...resultData,
						}))
			)
		);
	}
	getGrid();
	
	return {
		gridStructure,
		gridStat,
		getGrid
	};
}
