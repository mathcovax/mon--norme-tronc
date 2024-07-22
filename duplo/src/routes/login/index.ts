import { firebaseTokenCheck } from "@checkers/token";
import { inputUser, userExistCheck } from "@checkers/user";
import { AccessToken } from "@services/token";

/* METHOD : POST, PATH : /login */
export const POST = (method: Methods, path: string) => 
	duplo
		.declareRoute(method, path)
		.extract({
			body: zod.string()
		})
		.check(
			firebaseTokenCheck,
			{
				input: p => p("body"),
				...firebaseTokenCheck.preCompletions.mustBeValid
			},
			new IHaveSentThis(UnauthorizedHttpException.code, "firebase.token.invalid")
		)
		.check(
			userExistCheck,
			{
				input: p => inputUser.email(
					p("idTokenContent").email
				),
				...userExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "user.notfound")
		)
		.handler(
			({ pickup }) => {
				const { id, updatedAt } = pickup("user");
				const accessToken = AccessToken.generate({ id, lastUpdateUser: updatedAt.getTime() });

				throw new OkHttpException("user.logged", accessToken);
			},
			new IHaveSentThis(OkHttpException.code, "user.logged", zod.string())
		);
