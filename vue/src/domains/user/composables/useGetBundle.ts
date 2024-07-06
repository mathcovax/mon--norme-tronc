import type { Bundle } from "@/lib/utils";


export function useGetBundle(bundleId: number) {
	const bundle  = ref<Bundle | null>(null);

	function getBundle() {
		return duploTo.enriched
			.get(
				"/bundles/{bundleId}",
				{
					params: { bundleId }
				}
			)
			.info("bundle", data => {
				bundle.value = data;
			});
	}

	getBundle();

	return {
		getBundle,
		bundle
	};
}
