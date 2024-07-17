import type { Notifications } from "@/lib/utils";

export function useGetSubscribedNotifications() {
	const subscribedNotifications = ref<Notifications[]>([]);
	
	function getSubscribedNotifications(productSheetId: string | null = null, categoryName: string | null = null) {
		let query = {};

		if (productSheetId) {
			query = { ...query, productSheetId };
		} else if (categoryName) {
			query = { ...query, categoryName };
		}

		return duploTo.enriched
			.get(
				"/product-notifications",
				{ query: query }
			)
			.info("notifications", (data) => {
				subscribedNotifications.value = data;
			});
	}
	
	return {
		subscribedNotifications,
		getSubscribedNotifications
	};
}
