import "../setup";
import { FindSlice } from "@utils/findSlice";
import { mongoose } from "../setup/mongoose";
import { LastTime } from "../setup/lastTime";
import { PromiseList } from "../setup/promiseList";
import { FullNotification } from "@schemas/userNotification";
import { fullNotificationsModel } from "@mongoose/model";

const newLastIndexing = new Date();
const lastTime = new LastTime("productRestock");
const lastCreateNotification = await lastTime.get();

const productGenerator = FindSlice(
	100,
	(slice, size) => {
		const products = prisma.product.groupBy({
			by: ["productSheetId"],
			where: {
				createdAt: {
					gte: lastCreateNotification
				},
				status: "IN_STOCK"
			},
			_count: {
				_all: true
			},
			orderBy: {
				productSheetId: "desc"
			},
			skip: slice * size,
			take: size
		});

		return products;
	}
);

const promiseList = new PromiseList(1000);

for await (const product of productGenerator) {
	const notificationSubscribeGenerator = FindSlice(
		50,
		(slice, size) => prisma.subscribeProductNotifications.findMany({
			where: {
				type: "PRODUCT_RESTOCK",
				productSheetId: product.productSheetId
			},
			skip: slice * size,
			take: size
		})
	);

	const productSheet = await prisma.product_sheet.findUniqueOrThrow({
		where: { id: product.productSheetId },
		select: {
			name: true,
			images: {
				select: {
					url: true,
				},
				take: 1
			}
		}
	});

	for await (const subscribeNotification of notificationSubscribeGenerator) {
		const fullNotification: FullNotification = {
			title: `Restock pour le produit ${productSheet.name}`,
			subtitle: `Stock ajouté : ${product._count._all}`,
			imageUrl: productSheet.images[0]?.url,
			redirect: `/product/${product.productSheetId}`,
			userId: subscribeNotification.userId,
			type: "PRODUCT_RESTOCK",
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
