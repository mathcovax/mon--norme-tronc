import type { Category } from "@/lib/utils";

export function useGetCategories() {
	const categories = ref<Category[]>([]);

	function getCategories(page?: number, name?: string) {
		return duploTo.enriched
			.get(
				"/categories",
				{ query: { page, name, withDisabled: true } },
				{ disabledLoader: true }
			)
			.info("categories", (data) => {
				categories.value = data;
			})
			.result;
	}

	getCategories();
	return {
		categories,
		getCategories
	};
}
