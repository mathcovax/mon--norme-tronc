import type { GetDef } from "@/lib/duploTo/EnrichedDuploTo";
import type { Newsletter } from "@/lib/utils";

export type Query = Exclude<
	GetDef<"GET", "/newsletters">["parameters"]["query"], 
	undefined
>

export function useGetNewsletters() {
	const newsletters = ref<Newsletter[]>([]);
	let abortController: AbortController | undefined;

	function getNewsletters(page?: number, object?: string) {
		if (abortController) {
			abortController.abort();
		}
		
		abortController = new AbortController();

		return duploTo.enriched
			.get(
				"/newsletters",
				{ 
					query: { 
						page,
						object
					}, 
					signal: abortController.signal
				}
			)
			.info("newsletters", (data) => {
				newsletters.value = data;
			})
			.then(() => abortController = undefined)
			.result;	
	}

	const refreshSignal = ref(true);

	const newslettersQuery = reactive<Query>({
		page: 0,
		object: "",
	});

	watchEffect(
		() => {
			refreshSignal.value;
			getNewsletters(
				newslettersQuery.page, 
				newslettersQuery.object
			);
		}
	);

	return {
		newsletters,
		getNewsletters,
		newslettersQuery,
		refreshNewsletters: () => refreshSignal.value = !refreshSignal.value
	};
}
