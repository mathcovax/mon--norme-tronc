import { fullNotificationsModel } from "@mongoose/model";
import { fullNotificationSchema } from "@schemas/userNotification";
import { mustBeConnected } from "@security/mustBeConnected";

/* METHOD : GET, PATH : /user/notifications */
export const GET = (method: Methods, path: string) =>
	mustBeConnected({ pickup: ["accessTokenContent"] })
		.declareRoute(method, path)
		.cut(
			async ({ pickup }) => {
				const { id: userId } = pickup("accessTokenContent");				

				const notifications = fullNotificationsModel.aggregate([{ $match: { userId } }]);
				
				return { notifications };
			},
			["notifications"]
		)
		.handler(
			async ({ pickup }) => {
				const notifications = pickup("notifications");

				throw new OkHttpException("userNotifications", notifications);
			},
			new IHaveSentThis(OkHttpException.code, "userNotifications", fullNotificationSchema.array())
		);
