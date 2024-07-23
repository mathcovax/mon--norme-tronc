import type { ProductSheet } from "@/lib/utils";

export function useGetProductSheets(organizationId: string) {
	const productSheets = ref<ProductSheet[]>([]);

	function getProductSheets(page?: number, name?: string) {
		return duploTo.enriched
			.get(
				"/organizations/{organizationId}/product-sheets",
				{ params: { organizationId }, query: { page, name } },
				{ disabledLoader: true }
			)
			.info("productSheets.found", (data) => {
				productSheets.value = data;
			})
			.result;
	}
	getProductSheets();
	
	return {
		productSheets,
		getProductSheets
	};
}
