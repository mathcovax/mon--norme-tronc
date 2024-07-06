import { bundleExistCheck } from "@checkers/bundle";
import { mustBeConnected } from "./mustBeConnected";

export const userBelongsBundle = 
	mustBeConnected({ pickup: ["user"] })
		.declareAbstractRoute("userBelongsBundle")
		.extract({
			params: {
				bundleId: zod.coerce.number()
			}
		})
		.check(
			bundleExistCheck,
			{
				input: p => p("bundleId"),
				...bundleExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "bundle.notfound")
		)
		.cut(
			({ pickup }) => {
				const user = pickup("user");
				const bundle = pickup("bundle");

				if (bundle.userId !== user.id) {
					throw new UnauthorizedHttpException("bundle.wrong.user");
				}

				return {};
			},
			[],
			new IHaveSentThis(UnauthorizedHttpException.code, "bundle.wrong.user")
		)
		.build(["user", "bundle"]);
