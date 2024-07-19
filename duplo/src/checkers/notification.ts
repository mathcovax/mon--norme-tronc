import { createTypeInput, GetTypeInput } from "@duplojs/type-input";
import { Prisma } from "@prisma/client";

export const inputNotification = createTypeInput()
	.add<"notification", {
		type: "PRODUCT_PROMOTION" | "PRODUCT_RESTOCK";
		productSheetId: string;
		userId: string;
	} | {
		type: "NEW_PRODUCT_IN_CATEGORY";
		categoryName: string;
		userId: string;
	}>()
	.add<"notificationId", { id: number, userId: string }>()
	.build();

export const notificationExistCheck = duplo
	.createChecker("notificationExist")
	.handler(async ({ name, value }: GetTypeInput<typeof inputNotification>, output) => {
		let where: Prisma.subscribeProductNotificationsFindFirstArgs["where"];

		if (name === "notificationId") {
			where = {
				id: value.id,
				userId: value.userId
			};
		}
		else if (name === "notification") {
			where = {
				...value
			};
		}

		const notification = await prisma.subscribeProductNotifications.findFirst({
			where
		});
		if (notification) {
			return output("notification.exist", notification);
		}
		else {
			return output("notification.notfound", null);
		}
	})
	.preCompletion(
		"mustExist",
		{
			result: "notification.exist",
			catch: () => {
				throw new NotFoundHttpException("notification.notfound");
			},
			indexing: "notification"
		}
	)
	.build();
