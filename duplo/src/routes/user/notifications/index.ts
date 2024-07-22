import { fullNotificationsModel } from "@mongoose/model";
import { fullNotificationSchema } from "@schemas/userNotification";
import { mustBeConnected } from "@security/mustBeConnected";

/* METHOD : GET, PATH : /user/notifications */
export const GET = (method: Methods, path: string) =>
	mustBeConnected({ pickup: ["user"] })
		.declareRoute(method, path)
		.extract({
			query: {
				page: zod.coerce.number().default(0)
			}
		})
		.handler(
			async ({ pickup }) => {
				const { id: userId } = pickup("user");
				const page = pickup("page");				

				const userNotifications = await fullNotificationsModel.aggregate([
					{ $match: { userId } },
					{ $sort: { createdAt: -1 } },
					{ $skip: page * 10 },
					{ $limit: 10 }
				]);

				throw new OkHttpException("userNotifications", userNotifications);
			},
			new IHaveSentThis(OkHttpException.code, "userNotifications", fullNotificationSchema.array())
		);
