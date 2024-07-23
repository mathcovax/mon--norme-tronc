import type { OrganizationUser } from "@/lib/utils";

export function useGetOrganizationUsers(organizationId: string) {
	const organisationUsers = ref<OrganizationUser[]>([]);

	function getOrganizationUsers(page: number, email: string) {
		return duploTo.enriched
			.get(
				"/organizations/{organizationId}/users",
				{ params: { organizationId }, query: { page, email } },
				{ disabledLoader: true }
			)
			.info("organization.users", (data) => {
				organisationUsers.value = data;
			})
			.result;
	}

	return {
		organisationUsers,
		getOrganizationUsers
	};
}
