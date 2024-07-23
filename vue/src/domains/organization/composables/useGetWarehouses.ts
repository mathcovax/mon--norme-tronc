import type { Warehouse } from "@/lib/utils";

export function useGetWarehouses(organizationId: string) {
	const warehouses = ref<Warehouse[]>([]);

	function getWarehouses(page?: number, name?: string) {
		return duploTo.enriched
			.get(
				"/organizations/{organizationId}/warehouses",
				{ params: { organizationId }, query: { page, name } },
				{ disabledLoader: true }
			)
			.info("warehouses.found", (data) => {
				warehouses.value = data;
			});
	}

	getWarehouses();
	return {
		warehouses,
		getWarehouses
	};
}
