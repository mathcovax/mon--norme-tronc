import { userSchema } from "@schemas/user";
import { hasOrganizationRole } from "@security/hasOrganizationRole";
import { mustBeConnected } from "@security/mustBeConnected";

/* METHOD : GET, PATH : /organization/{organizationId}/users */
export const GET = (method: Methods, path: string) => 
	mustBeConnected({ pickup: ["accessTokenContent"] }) 
		.declareRoute(method, path)
		.extract({
			params: {
				organizationId: zod.string(),
			}, 
			query: {
				page: zod.coerce.number().default(0),
				email: zod.coerce.string().optional(),
			}
		})
		.process(
			hasOrganizationRole,
			{
				input: p => ({ 
					organizationId: p("organizationId"), 
					userId: p("accessTokenContent").id 
				}),
				options: { organizationRole: "OWNER" }
			}
		)
		.handler(
			async ({ pickup }) => {
				const organizationId = pickup("organizationId");
				const page = pickup("page");
				const email = pickup("email");

				const users = await prisma.user_to_organization.findMany({
					where: {
						organizationId,
						user: email 
							? {
								email: {
									contains: email
								}
							}
							: undefined
					},
					select: {
						user: true
					},
					take: 10,
					skip: page * 10,
				}).then(userToOrganizationCollection => userToOrganizationCollection.map(v => v.user));

				throw new OkHttpException("organization.users", users);
			},
			new IHaveSentThis(OkHttpException.code, "organization.users", userSchema.array())
		);
