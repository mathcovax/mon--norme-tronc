import { mustBeConnected } from "@security/mustBeConnected";
import { OptionsHasOrganizationRole, hasOrganizationRole } from ".";
import { inputProductSheet, productSheetExistCheck } from "@checkers/productSheet";
import { onUseDuplose } from "@duplojs/editor-tools";
import { Route } from "@duplojs/duplojs";

export const hasOrganizationRoleByProductSheetId = 
	mustBeConnected({ pickup: ["user"] })
		.declareAbstractRoute("hasOrganizationRoleByProductSheetId")
		.options<OptionsHasOrganizationRole>({
			organizationRole: "PRODUCT_SHEET_MANAGER"
		})
		.extract({
			params: {
				productSheetId: zod.string()
			}
		})
		.check(
			productSheetExistCheck,
			{
				input: (p) => inputProductSheet.id(p("productSheetId")),
				...productSheetExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "productSheet.notfound")
		)
		.process(
			hasOrganizationRole,
			{
				input: p => ({
					organizationId: p("productSheet").organizationId,
					userId: p("user").id
				}),
				options: p => ({ organizationRole: p("options").organizationRole })
			}
		)
		.build(["user", "productSheet"]);

/* istanbul ignore if -- @preserve */		
if (duplo.config.environment !== "TEST") {
	duplo.use(onUseDuplose, {
		duplose: hasOrganizationRoleByProductSheetId.abstractRoute,
		deep: 2,
		handler: (duplose) => {
			if (!(duplose instanceof Route)) {
				return;
			}
	
			duplose.paths.forEach((path) => {
				if (!path.includes("productSheetId")) {
					throw new Error(`Params 'productSheetId' is missing in path '${path}'.`);
				}
			});
		}
	});
}
