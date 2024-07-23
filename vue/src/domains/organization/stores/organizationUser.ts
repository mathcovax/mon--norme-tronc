import { type OrganizationRole, type OrganizationUser } from "@/lib/utils";
import { defineStore } from "pinia";

const organizationRolesHierarchy: Record<OrganizationRole, OrganizationRole[]> = {
	STORE_KEEPER: [],
	PRODUCT_SHEET_MANAGER: [],
	ACCOUNTANT: [],
	OWNER: ["STORE_KEEPER", "PRODUCT_SHEET_MANAGER", "ACCOUNTANT"],
};

export const useOrganizationUserStore = defineStore(
	"organizationUser",
	() => {
		const organizationUser = ref<null | OrganizationUser>(null);
		const params = useRouteParams({ organizationId: zod.string() });
		

		function fetchOrganizationValue() {
			
			duploTo.enriched
				.get(
					"/organizations/{organizationId}/user", 
					{ 
						params: { organizationId: params.value.organizationId } 
					}, 
					{ disabledToast: true }
				)
				.info("organization.user", (data) => {
					organizationUser.value = data;
				});
		}

		function hasRole(wantedRole: OrganizationRole) {
			const userRole = organizationUser.value?.organizationRole;

			if (!userRole) {
				return false;
			}

			if (
				userRole !== wantedRole &&
				!organizationRolesHierarchy[userRole].includes(wantedRole)
			) {
				return false;
			}

			return true;
		}

		function resetOrganizationValue() {
			organizationUser.value = null;
		}

		return {
			fetchOrganizationValue,
			resetOrganizationValue,
			hasRole,
			organizationUser
		};
	}
);
