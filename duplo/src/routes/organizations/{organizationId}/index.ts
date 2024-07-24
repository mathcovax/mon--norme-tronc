import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";
import { organizationSchema } from "@schemas/organization";
import { inputOrganization, organizationExistCheck } from "@checkers/organization";

/* METHOD : PATCH, PATH : /organizations/{organizationId} */
export const PATCH = (method: Methods, path: string) => 
	hasOrganizationRoleByOrganizationId({ pickup: ["organization"] })
		.declareRoute(method, path)
		.extract({
			body: zod.object({
				label: zod.string().max(36).optional(),
				emailSupport: zod.string().max(255).optional(),
			}).default({})
		})
		.handler(
			async ({ pickup }) => {
				const { id: organizationId } = pickup("organization");
				const { label, emailSupport } = pickup("body");
				
				const organization = await prisma.organization.update({
					where: {
						id: organizationId
					},
					data: {
						label,
						emailSupport,
					}
				});

				throw new OkHttpException("organization.edited", organization);
			},
			new IHaveSentThis(OkHttpException.code, "organization.edited", organizationSchema)
		);

/* METHOD : GET, PATH : /organizations/{organizationId} */
export const GET = (method: Methods, path: string) =>
	duplo
		.declareRoute(method, path)
		.extract({
			params: {
				organizationId: zod.string(),
			}
		})
		.check(
			organizationExistCheck,
			{
				input: p => inputOrganization.id(p("organizationId")),
				...organizationExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "organization.notfound")
		)
		.handler(
			async ({ pickup }) => {
				const organization = pickup("organization");
				
				throw new OkHttpException("organization.found", organization);
			},
			new IHaveSentThis(OkHttpException.code, "organization.found", organizationSchema)
		);
