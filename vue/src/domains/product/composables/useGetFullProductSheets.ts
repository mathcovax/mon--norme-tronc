import type { GetDef } from "../../../lib/duploTo/EnrichedDuploTo";
import type { FullProductSheet } from "@/lib/utils";

type Query = GetDef<
	"GET",
	"/full-product-sheets"
>["parameters"]["query"]

export function useGetFullProductSheets(query?: Query) {
	const productSheets = ref<FullProductSheet[] | false>([]);

	let abortController: AbortController | undefined;
	function getCategoryProductSheets(query?: Query) {
		if (abortController) {
			abortController.abort();
		}
		abortController = new AbortController();

		return duploTo.enriched
			.get(
				"/full-product-sheets",
				{ 
					query, 
					signal: abortController.signal 
				},
				{ disabledToast: true }
			)
			.info("fullProductSheets", (data) => {
				productSheets.value = data;
			})
			.e(() => {
				productSheets.value = false;
			})
			.result;
	}

	const categoryProductSheetsRefQuery = ref<Exclude<Query, undefined>>(query ?? {});
	
	watch(
		categoryProductSheetsRefQuery,
		() => {
			getCategoryProductSheets(categoryProductSheetsRefQuery.value);
		},
		{
			deep: true
		}
	);
	getCategoryProductSheets(query);
	
	return {
		productSheets,
		getCategoryProductSheets,
		categoryProductSheetsRefQuery
	};
}
