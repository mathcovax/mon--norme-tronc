import "./setup";
import { mongoose } from "./setup/mongoose";
import { FindSlice } from "@utils/findSlice";
import { LastTime } from "./setup/lastTime";
import { PromiseList } from "./setup/promiseList";
import { fullCommandModel } from "@mongoose/model";
import { command_status } from "@prisma/client";
import { confirmedCommandTemplate } from "@/templates/command/confirmed";
import { baseTemplate } from "@/templates";
import { Mail } from "@services/mail";
import { canceledCommandTemplate } from "@/templates/command/canceled";

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
		select: {
			commandId: true,
			type: true,
			command: {
				select: {
					user: {
						select: {
							firstname: true,
							email: true
						}
					}
				}
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
		Promise.all([
			prisma.command.update({
				where: {
					id: notification.commandId,
					status: "WAITING_PAYMENT",
				},
				data: {
					status: commandStatus,
				}
			}),
			fullCommandModel.updateOne(
				{ id: notification.commandId },
				{ status: commandStatus }
			),
			prisma.command_item.updateMany({
				where: {
					commandId: notification.commandId,
				},
				data: {
					canceled: true
				}
			})
		])
	);
	if (commandStatus === "IN_PROGRESS") {
		const confirmedTemplate = confirmedCommandTemplate(notification.command.user.firstname, `${ENV.ORIGIN}/commands/${notification.commandId}`);
		const html = baseTemplate(confirmedTemplate);
		Mail.send(notification.command.user.email, `Commande MET N°${notification.commandId}`, html);
	} else if (commandStatus === "CANCELED") {
		const canceledTemplate = canceledCommandTemplate(notification.command.user.firstname, `${ENV.ORIGIN}/commands/${notification.commandId}`);
		const html = baseTemplate(canceledTemplate);
		Mail.send(notification.command.user.email, `Commande MET annulée N°${notification.commandId}`, html);
	}
}

await promiseList.clear();
lastTime.set(newLastReadNotification);

mongoose.connection.close();

console.log("Finish readNotification");
