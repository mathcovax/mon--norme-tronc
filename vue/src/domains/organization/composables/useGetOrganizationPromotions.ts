import type { Promotion } from "@/lib/utils";

export function useGetOrganizationPromotions(organizationId: string) {
	const promotions = ref<Promotion[]>([]);

	function getOrganizationPromotions(page?: number) {
		return duploTo.enriched
			.get(
				"/organizations/{organizationId}/promotions",
				{ 
					params: { organizationId },
					query: { page }
				}
			)
			.info("organization.promotions", (data) => {
				promotions.value = data;
			});
	}

	getOrganizationPromotions();

	return {
		promotions,
		getOrganizationPromotions,
	};
}
