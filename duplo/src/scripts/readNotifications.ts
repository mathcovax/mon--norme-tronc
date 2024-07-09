import "./setup";
import { mongoose } from "./setup/mongoose";
import { FindSlice } from "@utils/findSlice";
import { LastTime } from "./setup/lastTime";
import { PromiseList } from "./setup/promiseList";
import { fullCommandModel } from "@mongoose/model";
import { command_status } from "@prisma/client";

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
	const commandStatus: command_status = notification.type === "checkout.session.completed"
		? "IN_PROGRESS"
		: "CANCELED";
	await promiseList.append(
		prisma.command.updateMany({
			where: {
				id: notification.commandId,
				status: "WAITING_PAYMENT",
			},
			data: {
				status: commandStatus
			}
		})
	);
	await promiseList.append(
		fullCommandModel.updateOne(
			{ id: notification.commandId },
			{ status: commandStatus }
		)
	);
}

await promiseList.clear();
lastTime.set(newLastReadNotification);

mongoose.connection.close();
