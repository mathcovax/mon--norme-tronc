import type { GetDef } from "@/lib/duploTo/EnrichedDuploTo";
import type { Product } from "@/lib/utils";

type Query = Exclude<
	GetDef<
		"GET",
		"/organization/{organizationId}/products"
	>["parameters"]["query"],
	undefined
>

export function useGetProducts(organizationId: string) {
	const products = ref<Product[]>([]);

	function getProducts(query: Query = {}) {
		return duploTo.enriched
			.get(
				"/organization/{organizationId}/products",
				{ 
					params: { organizationId }, 
					query, 
				},
				{ disabledLoader: true }
			)
			.info("products.found", (data) => {
				products.value = data;
			});
	}

	return {
		products,
		getProducts
	};
}
