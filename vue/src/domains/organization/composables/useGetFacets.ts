import type { Facet } from "@/lib/utils";

export function useGetFacets(organizationId: string) {
	const facets = ref<Facet[]>([]);

	function getFacets(page?: number, value?: string) {
		return duploTo.enriched
			.get(
				"/organizations/{organizationId}/facets",
				{ params: { organizationId }, query: { facetValue: value, page } },
				{ disabledLoader: true }
			)
			.info("productSheet.facets", (data) => {
				facets.value = data;
			})
			.result;
	}

	getFacets();
	return {
		facets,
		getFacets
	};
}
