import type { GetDef } from "@/lib/duploTo/EnrichedDuploTo";
import type { ProductReturn } from "@/lib/utils";

type Query = Exclude<
	GetDef<
		"GET",
		"/organizations/{organizationId}/product-returns"
	>["parameters"]["query"],
	undefined
> 


export function useGetProductReturn(organizationId: string) {
	const productReturns = ref<ProductReturn[]>([]);

	function getProductReturn(query: Query) {
		return duploTo.enriched
			.get(
				"/organizations/{organizationId}/product-returns",
				{
					params: { organizationId },
					query,
				},
				{ disabledLoader: true }
			)
			.info("productReturns", (data) => {
				productReturns.value = data;
			})
			.result;
	}

	const productReturnsQuery = ref<Query>({});

	watch(
		productReturnsQuery,
		() => getProductReturn(productReturnsQuery.value),
		{ immediate: true, deep: true }
	);

	return {
		getProductReturn,
		productReturns,
		productReturnsQuery,
		refreshProductReturns: () => getProductReturn(productReturnsQuery.value)
	};
}
