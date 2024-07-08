import { fullCommandModel } from "@mongoose/model";
import { fullCommandSchema } from "@schemas/command";
import { mustBeConnected } from "@security/mustBeConnected";

/* METHOD : GET, PATH : /commands */
export const GET = (method: Methods, path: string) => 
	mustBeConnected({ pickup: ["accessTokenContent"] })
		.declareRoute(method, path)
		.handler(
			async ({ pickup }) => {
				const { id: userId } = pickup("accessTokenContent");
				const fullCommands = await fullCommandModel.find({ userId: userId });

				throw new OkHttpException("userCommands", fullCommands);
			},
			new IHaveSentThis(OkHttpException.code, "userCommands", fullCommandSchema.array())
		);

