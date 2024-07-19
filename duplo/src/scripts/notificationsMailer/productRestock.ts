import "../setup";
import { FindSlice } from "@utils/findSlice";
import { mongoose } from "../setup/mongoose";
import { LastTime } from "../setup/lastTime";
import { PromiseList } from "../setup/promiseList";
import { fullNotificationsModel } from "@mongoose/model";
import { Mail } from "@services/mail";
import { FullNotification } from "@schemas/userNotification";

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
			email: true
		},
		skip: slice * size,
		take: size
	})
);

const promiseList = new PromiseList(1000);

for await (const user of usersGenerator) {
	const restockNotifications = fullNotificationsModel.aggregate<FullNotification>(
		[
			{
				$match: {
					userId: user.id,
					type: "PRODUCT_RESTOCK",
					createdAt: { $gte: lastSendRestockMail } 
				} 
			}
		]
	);
	for await (const notification of restockNotifications) {
		promiseList.append(
			Mail.send(
				user.email,
				notification.title,
				`${notification.title} <a href="${ENV.ORIGIN + notification?.redirect ?? ""}">voir le produit.</a>
				<br><br>${notification?.subtitle ?? ""}.`
			)
		);
	}
}

await promiseList.clear();
await lastTime.set(newLastIndexing);

mongoose.connection.close();

console.log("Finish sendMail:productRestock");
