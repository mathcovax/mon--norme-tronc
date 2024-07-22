import { inputUser, userExistCheck } from "@checkers/user";
import { organizationSchema } from "@schemas/organization";
import { mustBeConnected } from "@security/mustBeConnected";


/* METHOD : GET, PATH : /user/organizations */
export const GET = (method: Methods, path: string) => 
	mustBeConnected({ pickup: ["user"] })
		.declareRoute(method, path)
		.extract({
			query: {
				page: zod.coerce.number().default(0)
			}
		})
		.check(
			userExistCheck,
			{
				input: p => inputUser.id(
					p("user").id
				),
				...userExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "user.notfound")
		)
		.handler(
			async ({ pickup }) => {
				const { id: userId } = pickup("user");
				const page = pickup("page");

				const organizations = await prisma.user_to_organization.findMany({
					where: { 
						user: {
							id: userId,
						}
					},
					select: {
						organization: true,
					},
					take: 10,
					skip: page * 10
				}).then(organization => organization.map((o) => o.organization));

				throw new OkHttpException("user.organizations", organizations);
			},
			new IHaveSentThis(OkHttpException.code, "user.organizations", organizationSchema.array())
		);
