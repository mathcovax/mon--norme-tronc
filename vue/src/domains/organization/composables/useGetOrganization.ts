import type { Organization } from "@/lib/utils";

export function useGetOrganization(organizationId: string) {
	const organization = ref<Organization>({
		id: "",
		name: "",
		label: "",
		ownerId: "",
		suspended: false,
		logoKey: "",
		logoUrl: "",
		emailSupport: ""
	});

	function getOrganization() {
		return duploTo.enriched
			.get(
				"/organizations/{organizationId}",
				{ params: { organizationId } }
			)
			.info("organization.found", (data) => {
				organization.value = data;
			});
	}

	return {
		organization,
		getOrganization
	};
}
