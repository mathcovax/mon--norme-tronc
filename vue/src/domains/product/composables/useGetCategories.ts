import type { GetDef } from "../../../lib/duploTo/EnrichedDuploTo";
import type { Category } from "@/lib/utils";

type Query = GetDef<
	"GET",
	"/categories"
>["parameters"]["query"]

export function useGetCategories(query?: Query) {
	const categories = ref<Category[] | false>([]);

	function getCategories(query?: Query) {
		return duploTo.enriched
			.get(
				"/categories",
				{ query },
				{ disabledToast: true }
			)
			.info("categories", (data) => {
				categories.value = data;
			})
			.e(() => {
				categories.value = false;
			})
			.result;
	}

	getCategories(query);
	
	return {
		categories,
		getCategories
	};
}
