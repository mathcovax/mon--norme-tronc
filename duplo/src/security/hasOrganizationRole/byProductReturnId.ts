import { mustBeConnected } from "@security/mustBeConnected";
import { OptionsHasOrganizationRole, hasOrganizationRole } from ".";
import { productReturnExistCheck } from "@checkers/productReturn";

export const hasOrganizationRoleByProductReturnId =
	mustBeConnected({ pickup: ["user"] })
		.declareAbstractRoute("hasOrganizationRoleByProductReturnId")
		.options<OptionsHasOrganizationRole>({
			organizationRole: "STORE_KEEPER"
		})
		.extract({
			params: {
				productReturnId: zod.coerce.number()
			}
		})
		.check(
			productReturnExistCheck,
			{
				input: (p) => p("productReturnId"),
				...productReturnExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "productReturn.notfound")
		)
		.process(
			hasOrganizationRole,
			{
				input: p => ({
					organizationId: p("productReturn").organizationId,
					userId: p("user").id,
				}),
				options: p => ({ organizationRole: p("options").organizationRole })
			}
		)
		.build(["user", "productReturn"]);
