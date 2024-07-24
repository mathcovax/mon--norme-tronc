import { inputOrganization, organizationExistCheck } from "@checkers/organization";
import { organizationSchema } from "@schemas/organization";
import { hasPrimordialRole } from "@security/hasPrimordialRole";

/* METHOD : PATCH, PATH : /organizations/{organizationId} */
export const PATCH = (method: Methods, path: string) => 
	hasPrimordialRole({ options: { primordialRole: "ADMIN" } })
		.declareRoute(method, `${path}@admin`)
		.extract({
			params: {
				organizationId: zod.string(),
			},
			body: zod.object({
				suspended: zod.boolean().optional()
			}).default({})
		})
		.check(
			organizationExistCheck,
			{
				input: p => inputOrganization.id(
					p("organizationId")
				),
				...organizationExistCheck.preCompletions.mustExist,
			},
			new IHaveSentThis(NotFoundHttpException.code, "organization.notfound")
		)
		.handler(
			async ({ pickup }) => {
				const organizationId = pickup("organizationId");
				const { suspended } = pickup("body");

				const organization = await prisma.organization.update({
					where: {
						id: organizationId,
					},
					data: {
						suspended
					}
				});

				throw new OkHttpException("organization.edited", organization);
			},
			new IHaveSentThis(OkHttpException.code, "organization.edited", organizationSchema),
			new SwaggerIgnore(),
		);
