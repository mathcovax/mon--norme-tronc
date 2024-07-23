import { organizationHasUserCheck } from "@checkers/organization";
import { organizationRolesEnum } from "@schemas/organization";
import { hasOrganizationRole } from "@security/hasOrganizationRole";
import { mustBeConnected } from "@security/mustBeConnected";

/* METHOD : PATCH, PATH : /organizations/{organizationId}/users/{userId} */
export const PATCH = (method: Methods, path: string) =>
	mustBeConnected({ pickup: ["user"] })
		.declareRoute(method, path)
		.extract({
			params: {
				organizationId: zod.string(),
				userId: zod.string(),
			},
			body: zod.object({
				organizationRole: zod.enum([
					organizationRolesEnum.STORE_KEEPER,
					organizationRolesEnum.PRODUCT_SHEET_MANAGER,
					organizationRolesEnum.ACCOUNTANT,
				]).optional()
			}).strip().default({})
		})
		.process(
			hasOrganizationRole,
			{
				input: p => ({
					organizationId: p("organizationId"),
					userId: p("user").id
				}),
				options: { organizationRole: "OWNER" }
			}
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
			({ pickup }) => {
				const user = pickup("userToOrganization");
				if (user.organizationRole === "OWNER") {
					throw new UnauthorizedHttpException("organization.user.organizationRole.owner");
				}
				return {};
			},
			[],
			new IHaveSentThis(UnauthorizedHttpException.code, "organization.user.organizationRole.owner")
		)
		.handler(
			async ({ pickup }) => {
				const organizationId = pickup("organizationId");
				const userId = pickup("userId");
				const { organizationRole } = pickup("body");

				await prisma.user_to_organization.update({
					where: {
						userId_organizationId: {
							organizationId,
							userId,
						}
					},
					data: {
						organizationRole,
					}
				});

				throw new OkHttpException("organization.user.edited");
			},
			new IHaveSentThis(OkHttpException.code, "organization.user.edited")
		);

/* METHOD : DELETE, PATH : /organizations/{organizationId}/users/{userId} */
export const DELETE = (method: Methods, path: string) =>
	mustBeConnected({ pickup: ["user"] })
		.declareRoute(method, path)
		.extract({
			params: {
				organizationId: zod.string(),
				userId: zod.string(),
			}
		})
		.process(
			hasOrganizationRole,
			{
				input: p => ({
					organizationId: p("organizationId"),
					userId: p("user").id
				}),
				options: { organizationRole: "OWNER" }
			}
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
			({ pickup }) => {
				const user = pickup("userToOrganization");
				if (user.organizationRole === "OWNER") {
					throw new UnauthorizedHttpException("organization.user.organizationRole.owner");
				}
				return {};
			},
			[],
			new IHaveSentThis(UnauthorizedHttpException.code, "organization.user.organizationRole.owner")
		)
		.handler(
			async ({ pickup }) => {
				const organizationId = pickup("organizationId");
				const userId = pickup("userId");
	
				await prisma.user_to_organization.delete({
					where: {
						userId_organizationId: {
							organizationId,
							userId,
						}
					},
				});
	
				throw new NoContentHttpException("organization.user.deleted");
			},
			new IHaveSentThis(NoContentHttpException.code, "organization.user.deleted")
		);
