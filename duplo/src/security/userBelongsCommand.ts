import { commandExistCheck } from "@checkers/command";
import { mustBeConnected } from "./mustBeConnected";

export const userBelongsCommand = 
	mustBeConnected({ pickup: ["user"] })
		.declareAbstractRoute("userBelongsCommand")
		.extract({
			params: {
				commandId: zod.coerce.string()
			}
		})
		.check(
			commandExistCheck,
			{
				input: p => p("commandId"),
				...commandExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "command.notfound")
		)
		.cut(
			({ pickup }) => {
				const user = pickup("user");
				const command = pickup("command");

				if (command.userId !== user.id) {
					throw new UnauthorizedHttpException("command.wrong.user");
				}

				return {};
			},
			[],
			new IHaveSentThis(UnauthorizedHttpException.code, "command.wrong.user")
		)
		.build(["user", "command"]);
