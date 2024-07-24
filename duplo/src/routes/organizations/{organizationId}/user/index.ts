import { organizationHasUserCheck } from "@checkers/organization";
import { organizationUserSchema } from "@schemas/organization";
import { mustBeConnected } from "@security/mustBeConnected";

/* METHOD : GET, PATH : /organizations/{organizationId}/user */
export const GET = (method: Methods, path: string) =>
	mustBeConnected({ pickup: ["user"] })
		.declareRoute(method, path)
		.extract({
			params: {
				organizationId: zod.string(),
			}
		})
		.check(
			organizationHasUserCheck,
			{
				input: p => ({ 
					organizationId: p("organizationId"), 
					userId: p("user").id 
				}),
				...organizationHasUserCheck.preCompletions.mustHaveUser,
				result: "organization.hasUserWithMoreData",
				options: { selectUser: true }
			},
			new IHaveSentThis(NotAcceptableHttpException.code, "organization.hasNotUser")
		)
		.handler(
			async ({ pickup }) => {
				const { organizationRole, user: { id, email, lastname, firstname } } = pickup("userToOrganization");
				
				const organisationUser = {
					id,
					email,
					lastname,
					firstname,
					organizationRole,
				};

				throw new OkHttpException("organization.user", organisationUser);
			}, 
			new IHaveSentThis(OkHttpException.code, "organization.user", organizationUserSchema)
		);
