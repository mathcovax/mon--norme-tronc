import { fullCommandModel } from "@mongoose/model";
import { fullCommandSchema } from "@schemas/command";
import { mustBeConnected } from "@security/mustBeConnected";

/* METHOD : GET, PATH : /commands */
export const GET = (method: Methods, path: string) => 
	mustBeConnected({ pickup: ["accessTokenContent"] })
		.declareRoute(method, path)
		.extract({
			query: {
				page: zod.coerce.number().default(0),
				productSheetName: zod.string().optional(),
			}
		})
		.handler(
			async ({ pickup }) => {
				const { id: userId } = pickup("accessTokenContent");
				const page = pickup("page");
				const productSheetName = pickup("productSheetName");

				const fullCommands = await fullCommandModel.aggregate([
					{
						$match: { 
							userId,
							...(
								productSheetName
									? {
										items: {
											$elemMatch: {
												productSheetName: {
													$regex: new RegExp(productSheetName, "i")
												}
											}
										}
									}
									: undefined
							)
						} 
					},
					{ $sort: { createdDate: -1 } },
					{ $skip: page * 10 },
					{ $limit: 10 }
				]);

				throw new OkHttpException("userCommands", fullCommands);
			},
			new IHaveSentThis(OkHttpException.code, "userCommands", fullCommandSchema.array())
		);

