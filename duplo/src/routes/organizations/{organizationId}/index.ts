import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";
import { organizationSchema } from "@schemas/organization";

/* METHOD : PATCH, PATH : /organizations/{organizationId} */
export const PATCH = (method: Methods, path: string) => 
	hasOrganizationRoleByOrganizationId({ pickup: ["organization"] })
		.declareRoute(method, path)
		.extract({
			body: zod.object({
				label: zod.string().nullish()
			}).default({})
		})
		.handler(
			async ({ pickup }) => {
				const { id: organizationId } = pickup("organization");
				const { label } = pickup("body");
				
				const organization = await prisma.organization.update({
					where: {
						id: organizationId
					},
					data: {
						label: label === "" ? null : label,
						
					}
				});

				throw new OkHttpException("organization.edited", organization);
			},
			new IHaveSentThis(OkHttpException.code, "organization.edited", organizationSchema)
		);

/* METHOD : GET, PATH : /organizations/{organizationId} */
export const GET = (method: Methods, path: string) =>
	hasOrganizationRoleByOrganizationId({ 
		pickup: ["organization"],  
		options: { organizationRole: "BELONG_TO" }
	})
		.declareRoute(method, path)
		.handler(
			async ({ pickup }) => {
				const organization = pickup("organization");

				throw new OkHttpException("organization.found", organization);
			},
			new IHaveSentThis(OkHttpException.code, "organization.found", organizationSchema)
		);
