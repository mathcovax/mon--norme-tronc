import "../setup";
import { FindSlice } from "@utils/findSlice";
import { mongoose } from "../setup/mongoose";
import { LastTime } from "../setup/lastTime";
import { PromiseList } from "../setup/promiseList";
import { fullNotificationsModel } from "@mongoose/model";
import { Mail } from "@services/mail";
import { FullNotification } from "@schemas/userNotification";
import { productPromotionTemplate } from "@/templates/notifications/productPromotion";
import { baseTemplate } from "@/templates";

const newLastIndexing = new Date();
const lastTime = new LastTime("sendMailProductPromotion");
const lastSendPromotionMail = await lastTime.get();

const usersGenerator = FindSlice(
	50,
	(slice, size) => prisma.user.findMany({
		where: {
			emailNotifcationsPromotion: true,
			deleted: false
		},
		select: {
			id: true,
			email: true,
			firstname: true
		},
		skip: slice * size,
		take: size
	})
);

const promiseList = new PromiseList(1000);

for await (const user of usersGenerator) {
	const promotionNotifications = FindSlice(
		50,
		(slice, size) => fullNotificationsModel.aggregate<FullNotification>(
			[
				{
					$match: { 
						userId: user.id,
						type: "PRODUCT_PROMOTION",
						createdAt: { $gte: lastSendPromotionMail } 
					} 
				},
				{ $skip: slice * size },
				{ $limit: size }
			]
		)
	);
	for await (const notification of promotionNotifications) {
		const redirectUrl = ENV.ORIGIN + notification?.redirect ?? "";
		const promotionTemplate = productPromotionTemplate(user.firstname, redirectUrl);
		const html = baseTemplate(promotionTemplate);

		promiseList.append(
			Mail.send(
				user.email,
				notification.title,
				html
			)
		);
	}
}

await promiseList.clear();
await lastTime.set(newLastIndexing);

mongoose.connection.close();

console.log("Finish sendMail:productPromotion");
