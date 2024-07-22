import type { GetDef } from "@/lib/duploTo/EnrichedDuploTo";
import type { OrganizationCommandCollection } from "@/lib/utils";
import { effect } from "vue";

type Query = GetDef<
	"GET",
	"/organization/{organizationId}/commands"
>["parameters"]["query"]

export function useGetCommands(organizationId: string, query?: Query) {
	const organizationCommandCollection = ref<OrganizationCommandCollection>([]);

	let abortController: AbortController | undefined;
	function getCommands(query: Query) {
		if (abortController) {
			abortController.abort();
		}
		abortController = new AbortController();

		if (query.warehouseId === "none") {
			return;
		}

		return duploTo.enriched
			.get(
				"/organization/{organizationId}/commands",
				{
					params: {
						organizationId,
					},
					query
				},
				{ disabledToast: ["warehouse.notfound"] }
			)
			.info("organizationCommandCollection", (data) => {
				organizationCommandCollection.value = data;
			})
			.result;
	}

	const commandRefQuery = ref<Exclude<Query, undefined>>(query ?? { warehouseId: "none" });

	effect(() => {
		getCommands(commandRefQuery.value);
	});

	return {
		organizationCommandCollection,
		getCommands,
		commandRefQuery,
		refreshCommand: () => getCommands(commandRefQuery.value)
	};
}
