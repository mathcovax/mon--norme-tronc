import { inputUser, userExistCheck } from "@checkers/user";
import { hasPrimordialRole } from "@security/hasPrimordialRole";

/* METHOD : PATCH, PATH : /users/{userId} */
export const PATCH = (method: Methods, path: string) => 
	hasPrimordialRole({ options: { primordialRole: "MODERATOR" } })
		.declareRoute(method, `${path}@moderator`)
		.extract({
			params: {
				userId: zod.string(),
			},
			body: zod.object({
				muted: zod.boolean().optional(),
			}).default({})
		})
		.check(
			userExistCheck,
			{
				input: p => inputUser.id(
					p("userId")
				),
				...userExistCheck.preCompletions.mustExist,
			},
			new IHaveSentThis(NotFoundHttpException.code, "user.notfound")
		)
		.cut(
			({ pickup }) => {
				const user = pickup("user");
				if (user.primordialRole === "ADMIN") {
					throw new UnauthorizedHttpException("user.primordialRole.admin");
				}
				return {};
			},
			[],
			new IHaveSentThis(UnauthorizedHttpException.code, "user.primordialRole.admin")
		)
		.handler(
			async ({ pickup }) => {
				const userId = pickup("userId");
				const { muted } = pickup("body");

				await prisma.user.update({
					where: {
						id: userId
					},
					data: {
						muted
					}
				});

				throw new OkHttpException("user.edited");
			},
			new IHaveSentThis(OkHttpException.code, "user.edited"),
			new SwaggerIgnore(),
		);
