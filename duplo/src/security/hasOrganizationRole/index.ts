import { InputOrganizationHasUser, organizationHasUserCheck } from "@checkers/organization";
import { organization_role } from "@prisma/client";

export interface OptionsHasOrganizationRole {
	organizationRole: organization_role | "BELONG_TO";
}

const organizationRolesHierarchy: Record<organization_role, organization_role[]> = {
	STORE_KEEPER: [],
	PRODUCT_SHEET_MANAGER: [],
	ACCOUNTANT: [],
	OWNER: ["STORE_KEEPER", "PRODUCT_SHEET_MANAGER", "ACCOUNTANT"],
};

export const hasOrganizationRole = duplo
	.createProcess("hasOrganizationRole")
	.options<OptionsHasOrganizationRole>({ organizationRole: "OWNER" })
	.input<undefined | InputOrganizationHasUser>(() => undefined)
	.cut(
		({ pickup }) => {
			const input = pickup("input");

			if (!input) {
				throw new Error("input is missing in process hasOrganizationRole");
			}

			return {
				organizationId: input.organizationId,
				userId: input.userId
			};
		},
		["organizationId", "userId"]	
	)
	.check(
		organizationHasUserCheck,
		{
			input: p => ({ organizationId: p("organizationId"), userId: p("userId") }),
			...organizationHasUserCheck.preCompletions.mustHaveUser
		},
		new IHaveSentThis(NotAcceptableHttpException.code, "organization.hasNotUser")
	)
	.cut(
		async ({ pickup }) => {
			const { organizationRole: currentOrganizationRole } = pickup("options");
			const { organizationRole: userOrganizationRole } = pickup("userToOrganization");

			if (currentOrganizationRole === "BELONG_TO") {
				return {};
			} else if (
				userOrganizationRole !== currentOrganizationRole &&
				!organizationRolesHierarchy[userOrganizationRole].includes(currentOrganizationRole)
			) {
				throw new ForbiddenHttpException("user.role.organization.invalid");
			}

			return {};
		},
		[],
		new IHaveSentThis(ForbiddenHttpException.code, "user.role.organization.invalid")
	)
	.build(["userToOrganization"]);
