import { primordial_role } from "@prisma/client";
import { mustBeConnected } from "./mustBeConnected";

export interface HasPrimordialRoleOptions {
	primordialRole: primordial_role
}

const primordialRolesHierarchy: Record<primordial_role, primordial_role[]> = {
	CUSTOMER: [],
	MODERATOR: ["CUSTOMER"],
	CONTENTS_MASTER: ["CUSTOMER"],
	ADMIN: ["CONTENTS_MASTER", "MODERATOR", "CUSTOMER"],
};

export const hasPrimordialRole = mustBeConnected({ pickup: ["user"] })
	.declareAbstractRoute("hasPrimordialRole")
	.options<HasPrimordialRoleOptions>({
		primordialRole: "ADMIN"
	})
	.cut(
		({ pickup }) => {
			const { primordialRole: userPrimordialRole } = pickup("user");
			const { primordialRole: currentPrimordialRole } = pickup("options");

			if (
				userPrimordialRole !== currentPrimordialRole &&
				!primordialRolesHierarchy[userPrimordialRole].includes(currentPrimordialRole)
			) {
				throw new ForbiddenHttpException("user.role.invalid");
			}

			return {};
		},
		[],
		new IHaveSentThis(ForbiddenHttpException.code, "user.role.invalid")
	)
	.build(["user"]);
