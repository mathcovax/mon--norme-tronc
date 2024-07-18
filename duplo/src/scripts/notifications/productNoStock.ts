import "../setup";
import { FindSlice } from "@utils/findSlice";
import { mongoose } from "../setup/mongoose";
import { LastTime } from "../setup/lastTime";
import { PromiseList } from "../setup/promiseList";
import { fullNotificationsModel, fullProductSheetModel } from "@mongoose/model";
import { FullNotification } from "@schemas/userNotification";
import { FullProductSheetSchema } from "@schemas/fullProductSheet";

const newLastIndexing = new Date();
const lastTime = new LastTime("productNoStock");
const todayAtMidnight = new Date();

todayAtMidnight.setHours(0, 0, 0, 0);

const tomorrowAtMidnight = new Date();

tomorrowAtMidnight.setDate(todayAtMidnight.getDate() + 1);
tomorrowAtMidnight.setHours(0, 0, 0, 0);

const productPutStockGenerator = FindSlice(
	50,
	(slice, size) => fullProductSheetModel.aggregate<FullProductSheetSchema>([
		{ $match: { quantity: { $lte: 50 } } },
		{ $skip: slice * size },
		{ $limit: size }
	])
);

const promiseList = new PromiseList(1000);

for await (const product of productPutStockGenerator) {
	const storeKeeperUsers = await prisma.user_to_organization.findMany({
		where: {
			organizationId: product.organization.id,
			organizationRole: "STORE_KEEPER"
		},
		select: {
			userId: true,
			organizationId: true
		}
	});

	for await (const storeKeeperUser of storeKeeperUsers) {

		const notification = await fullNotificationsModel.findOne({
			userId: storeKeeperUser.userId,
			type: "PRODUCT_NO_STOCK",
			createdAt: {
				$gte: todayAtMidnight,
				$lte: tomorrowAtMidnight
			}
		});

		if (notification !== null) {
			continue;
		}

		const fullNotification: FullNotification = {
			title: `Stock faible pour le produit ${product.name}`,
			subtitle: `Le produit ${product.name} a un stock de ${product.quantity} unités !`,
			redirect: `/organization-panel/${storeKeeperUser.organizationId}/products`,
			type: "PRODUCT_NO_STOCK",
			imageUrl: product.images[0] ?? "",
			userId: storeKeeperUser.userId,
			createdAt: new Date()
		};

		await promiseList.append(fullNotificationsModel.create(fullNotification));
	}
}

await promiseList.clear();
await lastTime.set(newLastIndexing);
mongoose.connection.close();
