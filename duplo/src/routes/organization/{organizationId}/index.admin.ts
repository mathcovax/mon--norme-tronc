import { inputOrganization, organizationExistCheck } from "@checkers/organization";
import { hasPrimordialRole } from "@security/hasPrimordialRole";

/* METHOD : PATCH, PATH : /organization/{organizationId} */
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

				await prisma.organization.update({
					where: {
						id: organizationId,
					},
					data: {
						suspended
					}
				});

				throw new NoContentHttpException("organization.edited");
			},
			new IHaveSentThis(NoContentHttpException.code, "organization.edited"),
			new SwaggerIgnore(),
		);
