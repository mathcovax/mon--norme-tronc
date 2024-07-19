import "../setup";
import { FindSlice } from "@utils/findSlice";
import { mongoose } from "../setup/mongoose";
import { LastTime } from "../setup/lastTime";
import { PromiseList } from "../setup/promiseList";
import { fullNotificationsModel } from "@mongoose/model";
import { Mail } from "@services/mail";
import { FullNotification } from "@schemas/userNotification";

const newLastIndexing = new Date();
const lastTime = new LastTime("sendMailNewProductInCategory");
const lastSendNewProductInCategoryMail = await lastTime.get();

const usersGenerator = FindSlice(
	50,
	(slice, size) => prisma.user.findMany({
		where: {
			emailNotifcationsNewProductInCategory: true,
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
	const newProductInCategoryNotifications = FindSlice(
		50,
		(slice, size) => fullNotificationsModel.aggregate<FullNotification>(
			[
				{
					$match: {
						userId: user.id,
						type: "NEW_PRODUCT_IN_CATEGORY",
						createdAt: { $gte: lastSendNewProductInCategoryMail }
					}
				},
				{ $skip: slice * size },
				{ $limit: size }
			]
		)
	);
	for await (const notification of newProductInCategoryNotifications) {
		promiseList.append(
			Mail.send(
				user.email,
				notification.title,
				`${notification.title}<br><br>
				${notification?.subtitle ?? ""}<a href="${ENV.ORIGIN + notification?.redirect ?? ""}">voir le produit.</a>`
			)
		);
	}
}

await promiseList.clear();
await lastTime.set(newLastIndexing);

mongoose.connection.close();

console.log("Finish sendMail:newProductInCategory");
