import type { GetDef } from "@/lib/duploTo/EnrichedDuploTo";
import type { FullProductSheet } from "@/lib/utils";

type Query = Exclude<
	GetDef<
		"GET",
		"/organization/{organizationId}/full-product-sheets"
	>["parameters"]["query"],
	undefined
>

export function useGetFullProductSheet(organizationId: string) {
	const fullProductSheet = ref<FullProductSheet[]>([]);

	function getFullProductSheet(query: Query) {
		return duploTo.enriched
			.get(
				"/organization/{organizationId}/full-product-sheets",
				{
					params: { organizationId },
					query,
				}
			)
			.info("organization.fullProductSheet", data => {
				fullProductSheet.value = data;
			});
	}

	const fullProductSheetQuery = ref<Query>({});

	watch(
		fullProductSheetQuery,
		() => getFullProductSheet(fullProductSheetQuery.value),
		{ immediate: true, deep: true }
	);

	return {
		getFullProductSheet,
		fullProductSheet,
		fullProductSheetQuery,
	};
}
