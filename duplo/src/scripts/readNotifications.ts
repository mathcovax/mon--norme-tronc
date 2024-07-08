import "./setup";
import { FindSlice } from "@utils/findSlice";
import { LastTime } from "./setup/lastTime";
import { PromiseList } from "./setup/promiseList";

const newLastReadNotification = new Date();
const lastTime = new LastTime("readNotification");
const lastReadNotification = await lastTime.get();


const generator = FindSlice(
	50,
	(slice, size) => prisma.stripe_notification_checkout.findMany({
		where: {
			createdAt: {
				gte: lastReadNotification
			}
		},
		skip: slice * size,
		take: size,
	})
);

const promiseList = new PromiseList(1000);

for await (const notification of generator) {
	await promiseList.append(
		prisma.command.updateMany({
			where: {
				id: notification.commandId,
				status: "WAITING_PAYMENT",
			},
			data: {
				status: notification.type === "checkout.session.completed"
					? "IN_PROGESS"
					: "CANCELED"
			}
		})
	);
}

await promiseList.clear();
lastTime.set(newLastReadNotification);
