import "../setup";
import { FindSlice } from "@utils/findSlice";
import { mongoose } from "../setup/mongoose";
import { LastTime } from "../setup/lastTime";
import { PromiseList } from "../setup/promiseList";
import { fullNotificationsModel } from "@mongoose/model";
import { Mail } from "@services/mail";
import { FullNotification } from "@schemas/userNotification";
import { productRestockTemplate } from "@/templates/notifications/productRestock";

const newLastIndexing = new Date();
const lastTime = new LastTime("sendMailProductRestock");
const lastSendRestockMail = await lastTime.get();

const usersGenerator = FindSlice(
	50,
	(slice, size) => prisma.user.findMany({
		where: {
			emailNotifcationsProductStock: true,
			deleted: false
		},
		select: {
			id: true,
			email: true,
			firstname: true,
		},
		skip: slice * size,
		take: size
	})
);

const promiseList = new PromiseList(1000);

for await (const user of usersGenerator) {
	const restockNotifications = FindSlice(
		50,
		(slice, size) => fullNotificationsModel.aggregate<FullNotification>(
			[
				{
					$match: {
						userId: user.id,
						type: "PRODUCT_RESTOCK",
						createdAt: { $gte: lastSendRestockMail } 
					} 
				},
				{ $skip: slice * size },
				{ $limit: size }
			]
		)
	);
	for await (const notification of restockNotifications) {
		const redirectUrl = ENV.ORIGIN + notification?.redirect ?? "";
		await promiseList.append(
			Mail.send(
				user.email,
				notification.title,
				productRestockTemplate(
					user.firstname,
					redirectUrl
				)
			)
		);
	}
}

await promiseList.clear();
await lastTime.set(newLastIndexing);

mongoose.connection.close();

console.log("Finish sendMail:productRestock");
