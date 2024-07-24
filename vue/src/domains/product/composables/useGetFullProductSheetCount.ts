import type { GetDef } from "../../../lib/duploTo/EnrichedDuploTo";

type Query = GetDef<
	"GET",
	"/full-product-sheets-count"
>["parameters"]["query"]

export function useGetFullProductSheetCount(query?: Query) {
	const fullProductSheetCount = ref<number>(0); 

	let abortController: AbortController | undefined;
	function getFullProductSheetCount(query?: Query) {
		if (abortController) {
			abortController.abort();
		}
		abortController = new AbortController();

		return duploTo.enriched
			.get(
				"/full-product-sheets-count",
				{
					query,
					signal: abortController.signal
				},
				{ disabledToast: true }
			)
			.info("fullProductSheetCount", (data) => {
				fullProductSheetCount.value = Number(data.fullProductSheetCount);
			})
			.result;
	}

	const fullProductSheetCountRefQuery = ref<Exclude<Query, undefined>>(query ?? {});
	
	watch(
		fullProductSheetCountRefQuery,
		() => {
			getFullProductSheetCount(fullProductSheetCountRefQuery.value);
		}, 
		{ 
			deep: true 
		}
	);
	getFullProductSheetCount(query);

	return {
		getFullProductSheetCount,
		fullProductSheetCount,
		fullProductSheetCountRefQuery
	};
}
