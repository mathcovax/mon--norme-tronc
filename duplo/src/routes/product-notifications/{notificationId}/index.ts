import { inputNotification, notificationExistCheck } from "@checkers/notification";
import { mustBeConnected } from "@security/mustBeConnected";

/* METHOD : DELETE, PATH : /product-notifications/{notificationId} */
export const DELETE = (method: Methods, path: string) =>
	mustBeConnected({ pickup: ["user"] })
		.declareRoute(method, path)
		.extract({
			params: {
				notificationId: zod.coerce.number()
			}
		})
		.check(
			notificationExistCheck,
			{
				input: (p) => inputNotification.notificationId({ id: p("notificationId"), userId: p("user").id }),
				result: "notification.exist",
				catch: () => {
					throw new NotFoundHttpException("notification.notfound");
				},
				indexing: "notification"
			},
			new IHaveSentThis(NotFoundHttpException.code, "notification.notfound")
		)
		.handler(
			async ({ pickup }) => {
				const notification = pickup("notification");

				await prisma.subscribeProductNotifications.delete({
					where: {
						id: notification.id
					}
				});
				throw new NoContentHttpException("notification.deleted");
			},
			new IHaveSentThis(NoContentHttpException.code, "notification.deleted")
		);
