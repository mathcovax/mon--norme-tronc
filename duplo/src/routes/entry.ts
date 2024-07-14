import { organizationHasUserCheck } from "@checkers/organization";
import { accessTokenCheck } from "@checkers/token";
import { productSheetExistCheck, inputProductSheet } from "@checkers/productSheet";
import { hasOrganizationRole } from "@security/hasOrganizationRole";
import { hasPrimordialRole } from "@security/hasPrimordialRole";
import { mustBeConnected } from "@security/mustBeConnected";
import { userBelongsBundle } from "@security/userBelongsBundle";

export const adminPanelEntry = 
	hasPrimordialRole({ options: { primordialRole: "ADMIN" } })
		.declareRoute("GET", "/entry/admin-panel*")
		.handler(
			() => {
				throw new NoContentHttpException("entry.accepted");
			},
			new IHaveSentThis(NoContentHttpException.code, "entry.accepted"),
			new SwaggerIgnore(),
		);

export const contentPanelEntry = 
	hasPrimordialRole({ options: { primordialRole: "CONTENTS_MASTER" } })
		.declareRoute("GET", "/entry/content-panel*")
		.handler(
			() => {
				throw new NoContentHttpException("entry.accepted");
			},
			new IHaveSentThis(NoContentHttpException.code, "entry.accepted"),
			new SwaggerIgnore(),
		);

export const organizationOwnerEntry = 
	mustBeConnected({ pickup: ["accessTokenContent"] })
		.declareRoute(
			"GET", 
			[
				"/entry/organization-panel/{organizationId}/manage-user", 
				"/entry/organization-panel/{organizationId}/manage",
				"/entry/organization-panel/{organizationId}/warehouses"
			]
		)
		.extract({
			params: {
				organizationId: zod.string(),
			}
		})
		.process(
			hasOrganizationRole,
			{
				input: p => ({ organizationId: p("organizationId"), userId: p("accessTokenContent").id }),
				options: { organizationRole: "OWNER" }
			}
		)
		.handler(
			async () => {
				throw new NoContentHttpException("entry.accepted");
			},
			new IHaveSentThis(NoContentHttpException.code, "entry.accepted"),
			new SwaggerIgnore(),
		);

export const organizationProductSheetManagerEntry = 
	mustBeConnected({ pickup: ["accessTokenContent"] })
		.declareRoute(
			"GET", 
			[
				"/entry/organization-panel/{organizationId}/product-sheets",
				"/entry/organization-panel/{organizationId}/edit-product-sheet/{productSheetId}",
				"/entry/organization-panel/{organizationId}/create-product-sheet",
				"/entry/organization-panel/{organizationId}/promotions"
			]
		)
		.extract({
			params: {
				organizationId: zod.string(),
				productSheetId: zod.string().optional()
			}
		})
		.check(
			productSheetExistCheck,
			{
				input: (p) => inputProductSheet.id(p("productSheetId") ?? ""),
				result: "productSheet.exist",
				catch: () => {
					throw new UnauthorizedHttpException("entry.refuse");
				},
				indexing: "productSheet",
				skip: p => !p("productSheetId")
			},
			new IHaveSentThis(UnauthorizedHttpException.code, "entry.refuse")
		)
		.process(
			hasOrganizationRole,
			{
				input: p => ({ 
					organizationId: p("productSheet")?.organizationId ?? p("organizationId"), 
					userId: p("accessTokenContent").id 
				}),
				options: { organizationRole: "PRODUCT_SHEET_MANAGER" }
			}
		)
		.handler(
			async () => {
				throw new NoContentHttpException("entry.accepted");
			},
			new IHaveSentThis(NoContentHttpException.code, "entry.accepted"),
			new SwaggerIgnore(),
		);

export const organizationStoreKeeperEntry = 
	mustBeConnected({ pickup: ["accessTokenContent"] })
		.declareRoute(
			"GET", 
			[
				"/entry/organization-panel/{organizationId}/products",
				"/entry/organization-panel/{organizationId}/commands",
				"/entry/organization-panel/{organizationId}/product-return",
			]
		)
		.extract({
			params: {
				organizationId: zod.string()
			}
		})
		.process(
			hasOrganizationRole,
			{
				input: p => ({ 
					organizationId: p("organizationId"), 
					userId: p("accessTokenContent").id 
				}),
				options: { organizationRole: "STORE_KEEPER" }
			}
		)
		.handler(
			async () => {
				throw new NoContentHttpException("entry.accepted");
			},
			new IHaveSentThis(NoContentHttpException.code, "entry.accepted"),
			new SwaggerIgnore(),
		);

export const organizationEntry = 
	mustBeConnected({ pickup: ["accessTokenContent"] })
		.declareRoute("GET", "/entry/organization-panel/{organizationId}*")
		.extract({
			params: {
				organizationId: zod.string(),
			}
		})
		.check(
			organizationHasUserCheck,
			{
				input: p => ({ organizationId: p("organizationId"), userId: p("accessTokenContent").id }),
				result: "organization.hasUser",
				catch: () => {
					throw new UnauthorizedHttpException("entry.refuse");
				}
			},
			new IHaveSentThis(UnauthorizedHttpException.code, "entry.refuse"),
		)
		.handler(
			async () => {
				throw new NoContentHttpException("entry.accepted");
			},
			new IHaveSentThis(NoContentHttpException.code, "entry.accepted"),
			new SwaggerIgnore(),
		);

export const authEntry = 
	duplo
		.declareRoute("GET", ["/entry/login", "/entry/register"])
		.extract({
			headers: {
				"access-token": zod.string().default("").ignore()
			}
		})
		.check(
			accessTokenCheck,
			{
				input: p => p("access-token"),
				result: "access.token.invalid",
				catch: () => {
					throw new UnauthorizedHttpException("entry.refuse");
				}
			}
		)
		.handler(
			() => {
				throw new NoContentHttpException("entry.accepted");
			},
			new IHaveSentThis(NoContentHttpException.code, "entry.accepted"),
			new SwaggerIgnore(),
		);

export const bundleEntry = 
	userBelongsBundle()
		.declareRoute(
			"GET",
			["/entry/bundle/{bundleId}"]
		)
		.handler(
			async () => {
				throw new NoContentHttpException("entry.accepted");
			},
			new IHaveSentThis(NoContentHttpException.code, "entry.accepted"),
			new SwaggerIgnore(),
		);

export const selfEntry = 
		mustBeConnected({ pickup: ["accessTokenContent"] })
			.declareRoute(
				"GET",
				[
					"/entry/edit-profile", 
					"/entry/my-organizations", 
					"/entry/order", 
					"/entry/commands", 
					"/entry/commands/{commandId}"
				]
			)
			.handler(
				async () => {
					throw new NoContentHttpException("entry.accepted");
				},
				new IHaveSentThis(NoContentHttpException.code, "entry.accepted"),
				new SwaggerIgnore(),
			);
	
export const basicEntry = 
	duplo
		.declareRoute("GET", "/entry*")
		.handler(
			() => {
				throw new NoContentHttpException("entry.accepted");
			},
			new IHaveSentThis(NoContentHttpException.code, "entry.accepted"),
			new SwaggerIgnore(),
		);
