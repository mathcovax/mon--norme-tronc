import { mustBeConnected } from "@security/mustBeConnected";
import { OptionsHasOrganizationRole, hasOrganizationRole } from ".";
import { onUseDuplose } from "@duplojs/editor-tools";
import { Route } from "@duplojs/duplojs";
import { productExistCheck } from "@checkers/product";

export const hasOrganizationRoleBySku = 
	mustBeConnected({ pickup: ["user"] })
		.declareAbstractRoute("hasOrganizationRoleBySku")
		.options<OptionsHasOrganizationRole>({
			organizationRole: "STORE_KEEPER"
		})
		.extract({
			params: {
				sku: zod.string()
			}
		})
		.check(
			productExistCheck,
			{
				input: (p) => p("sku"),
				...productExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "product.notfound")
		)
		.process(
			hasOrganizationRole,
			{
				input: p => ({
					organizationId: p("product").organizationId,
					userId: p("user").id
				}),
				options: p => ({ organizationRole: p("options").organizationRole })
			}
		)
		.build(["user", "product"]);

/* istanbul ignore if -- @preserve */		
if (duplo.config.environment !== "TEST") {
	duplo.use(onUseDuplose, {
		duplose: hasOrganizationRoleBySku.abstractRoute,
		deep: 2,
		handler: (duplose) => {
			if (!(duplose instanceof Route)) {
				return;
			}
	
			duplose.paths.forEach((path) => {
				if (!path.includes("sku")) {
					throw new Error(`Params 'sku' is missing in path '${path}'.`);
				}
			});
		}
	});
}
