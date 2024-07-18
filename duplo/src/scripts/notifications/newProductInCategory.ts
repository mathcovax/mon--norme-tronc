import "../setup";
import { FindSlice } from "@utils/findSlice";
import { mongoose } from "../setup/mongoose";
import { LastTime } from "../setup/lastTime";
import { PromiseList } from "../setup/promiseList";
import { FullNotification } from "@schemas/userNotification";
import { fullNotificationsModel } from "@mongoose/model";

const newLastIndexing = new Date();
const lastTime = new LastTime("newProductInCategory");
const lastCreateNotification = await lastTime.get();

const newProductInCategoryGenerator = FindSlice(
	50,
	(slice, size) => prisma.product_sheet_to_category.findMany({
		where: {
			createdAt: {
				gte: lastCreateNotification
			}
		},
		include: {
			productSheet: {
				select: {
					name: true
				}
			},
			category: {
				select: {
					imageUrl: true
				}
			}
		},
		skip: slice * size,
		take: size
	})
);

const promiseList = new PromiseList(1000);

for await (const newProductInCategory of newProductInCategoryGenerator) {
	const notificationSubscribeGenerator = FindSlice(
		50,
		(slice, size) => prisma.subscribeProductNotifications.findMany({
			where: {
				type: "NEW_PRODUCT_IN_CATEGORY",
				categoryName: newProductInCategory.categoryName
			},
			skip: slice * size,
			take: size
		})
	);



	for await (const subscribeNotification of notificationSubscribeGenerator) {
		const fullNotification: FullNotification = {
			title: `Nouveau produit dans la catégorie ${newProductInCategory.categoryName}`,
			subtitle: `Découvrez le produit ${newProductInCategory.productSheet.name}`,
			redirect: `/product/${newProductInCategory.productSheetId}`,
			imageUrl: newProductInCategory.category.imageUrl ?? "",
			userId: subscribeNotification.userId,
			type: "NEW_PRODUCT_IN_CATEGORY",
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
