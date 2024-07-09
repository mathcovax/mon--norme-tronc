import { fullCommandModel } from "@mongoose/model";
import { fullCommandSchema } from "@schemas/command";
import { userBelongsCommand } from "@security/userBelongsCommand";

/* METHOD : GET, PATH : /commands/{commandId} */
export const GET = (method: Methods, path: string) => 
	userBelongsCommand({ pickup: ["command"] })
		.declareRoute(method, path)
		.handler(
			async ({ pickup }) => {
				const { id: commandId } = pickup("command");
				const fullCommand = await fullCommandModel.findOne({ id: commandId });

				throw new OkHttpException("command.found", fullCommand);
			},
			new IHaveSentThis(OkHttpException.code, "command.found", fullCommandSchema)
		);
