import type { GetDef } from "@/lib/duploTo/EnrichedDuploTo";
import { type ProductStockStory } from "@/lib/utils";

type Query = Exclude<
	GetDef<
		"GET",
		"/product-sheet/{productSheetId}/stock-story"
	>["parameters"]["query"],
	undefined
>

export function useGetProductStockStory() {
	const productStockStory = ref<ProductStockStory>();

	function getProductStockStory(productSheetId: string, query?: Query) {
		return duploTo.enriched
			.get(
				"/product-sheet/{productSheetId}/stock-story",
				{ 
					params: { productSheetId }, 
					query, 
				}
			)
			.info("product.stockStory", (data) => {
				productStockStory.value = data;
			});
	}

	return {
		productStockStory,
		getProductStockStory
	};
}
