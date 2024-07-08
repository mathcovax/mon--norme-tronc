import { commandExistCheck } from "@checkers/command";
import { fullCommandModel } from "@mongoose/model";
import { fullCommandSchema } from "@schemas/command";
import { mustBeConnected } from "@security/mustBeConnected";

/* METHOD : GET, PATH : /commands/{commandId} */
export const GET = (method: Methods, path: string) => 
	mustBeConnected({ pickup: ["accessTokenContent"] })
		.declareRoute(method, path)
		.extract({
			params: {
				commandId: zod.string()
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
		.handler(
			async ({ pickup }) => {
				const commandId = pickup("commandId");
				const fullCommand = await fullCommandModel.findOne({ id: commandId });

				throw new OkHttpException("command.found", fullCommand);
			},
			new IHaveSentThis(OkHttpException.code, "command.found", fullCommandSchema)
		);
