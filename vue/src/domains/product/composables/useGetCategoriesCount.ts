export function useGetCategoriesCount() {
	const categoriesCount = ref<number>(0); 

	function getCategoriesCount() {
		return duploTo.enriched
			.get("/categories-count")
			.info("categoriesCount", (data) => {
				categoriesCount.value = data.categoriesCount;
			})
			.e(() => {
				categoriesCount.value = 0;
			})
			.result;
	}

	getCategoriesCount();
	
	return {
		categoriesCount,
		getCategoriesCount
	};
}
