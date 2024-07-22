import { accessTokenCheck } from "@checkers/token";
import { inputUser, userExistCheck } from "@checkers/user";

export const mustBeConnected = duplo
	.declareAbstractRoute("mustBeConnected")
	.extract(
		{
			headers: {
				authorization: zod.string()
					.transform(value => /^Bearer (.+)$/.exec(value)?.[0] ?? "")
					.ignore()
			}
		},
		() => {
			throw new UnauthorizedHttpException("access.token.invalid");
		}
	)
	.check(
		accessTokenCheck,
		{
			input: p => p("authorization"),
			...accessTokenCheck.preCompletions.mustBeValid
		},
		new IHaveSentThis(UnauthorizedHttpException.code, "access.token.invalid")
	)
	.check(
		userExistCheck,
		{
			input: p => inputUser.id(p("accessTokenContent").id),
			...userExistCheck.preCompletions.mustExist
		},
		new IHaveSentThis(NotFoundHttpException.code, "user.notfound")
	)
	.cut(
		({ pickup }) => {
			const user = pickup("user");
			const accessTokenContent = pickup("accessTokenContent");
			const lastUpdateUser = new Date(accessTokenContent.lastUpdateUser);

			if (user.updatedAt.getTime() !== lastUpdateUser.getTime()) {
				throw new UnauthorizedHttpException("accessToken.tooOld");
			}

			return {};
		},
		[],
		new IHaveSentThis(UnauthorizedHttpException.code, "accessToken.tooOld")
	)
	.cut(
		({ pickup }) => {
			const user = pickup("user");

			if (user.deleted === true) {
				throw new UnauthorizedHttpException("user.deleted");
			}

			return {};
		},
		[],
		new IHaveSentThis(UnauthorizedHttpException.code, "user.deleted")
	)
	
	.build(["user"]);
