import "../setup";
import { FindSlice } from "@utils/findSlice";
import { mongoose } from "../setup/mongoose";
import { LastTime } from "../setup/lastTime";
import { PromiseList } from "../setup/promiseList";
import { fullNotificationsModel } from "@mongoose/model";
import { FullNotification } from "@schemas/userNotification";

const newLastIndexing = new Date();
const lastTime = new LastTime("productPromotion");
const lastCreateNotification = await lastTime.get();

const promotionGenerator = FindSlice(
	50,
	(slice, size) => prisma.promotion.findMany({
		where: {
			startDate: {
				lte: newLastIndexing,
				gte: lastCreateNotification
			},
			endDate: {
				gte: newLastIndexing
			}
		},
		include: {
			productSheet: {
				select: {
					name: true,
					images: {
						select: {
							url: true
						},
						take: 1
					}
				}
			}
		},
		skip: slice * size,
		take: size
	})
);

const promiseList = new PromiseList(1000);

for await (const promotion of promotionGenerator) {
	const notificationSubscribeGenerator = FindSlice(
		50,
		(slice, size) => prisma.subscribeProductNotifications.findMany({
			where: {
				type: "PRODUCT_PROMOTION",
				productSheetId: promotion.productSheetId
			},
			skip: slice * size,
			take: size
		})
	);

	for await (const subscribeNotification of notificationSubscribeGenerator) {
		const fullNotification: FullNotification = {
			title: `Promotion pour le produit ${promotion.productSheet.name}`,
			subtitle: `Promotion de ${promotion.percentage}%`,
			imageUrl: promotion.productSheet.images[0]?.url ?? "",
			redirect: `/product/${promotion.productSheetId}`,
			userId: subscribeNotification.userId,
			type: "PRODUCT_PROMOTION",
			createdAt: new Date()
		};
		await promiseList.append(
			fullNotificationsModel.create(fullNotification)
		);
	}
}

await promiseList.clear();
await lastTime.set(newLastIndexing);

mongoose.connection.close();


