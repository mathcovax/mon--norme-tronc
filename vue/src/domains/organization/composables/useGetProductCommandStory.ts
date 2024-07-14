import type { FullCommand } from "@/lib/utils";

export function useGetProductCommandStory() {
	const productCommandsStory = ref<FullCommand[]>([]);

	function getProductCommandStory(sku: string) {
		return duploTo.enriched
			.get(
				"/product/{sku}/commands-story",
				{ 
					params: { sku },
				}
			)
			.info("product.commandHistory", (data) => {
				productCommandsStory.value = data;
			});
	}

	return {
		productCommandsStory,
		getProductCommandStory
	};
}
