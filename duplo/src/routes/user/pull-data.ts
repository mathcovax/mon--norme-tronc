import { FullProductSheetSchema } from "@schemas/fullProductSheet";
import { mustBeConnected } from "@security/mustBeConnected";
import { Mail } from "@services/mail";
import { AfterSendAbstractRoute } from "@utils/AfterSendAbstractRoute";
import { FindSlice } from "@utils/findSlice";
import { createWriteStream } from "fs";
import { unlink } from "fs/promises";

/* METHOD : POST, PATH : /user/pull-data */
export const POST = (method: Methods, path: string) => 
	duplo
		.mergeAbstractRoute([
			mustBeConnected({ pickup: ["user"] }),
			AfterSendAbstractRoute({ pickup: ["afterSend"] }),
		])
		.declareRoute(method, path)
		.cut(
			async ({ pickup }) => {
				const user = pickup("user");

				if (user.lastPullData.getTime() + MetConfig.user.intervalPullData > Date.now()) {
					throw new UnauthorizedHttpException("user.intervalPullData");
				}

				return {};
			},
			[],
			new IHaveSentThis(UnauthorizedHttpException.code, "user.intervalPullData")
		)
		.handler(
			async ({ pickup }) => {
				const user = pickup("user");
				const afterSend = pickup("afterSend");

				await prisma.user.update({
					where: {
						id: user.id
					},
					data: {
						lastPullData: new Date(),
					}
				});

				afterSend(async () => {
					const pathFile = `${MetConfig.user.pathTempDataFile}/${user.id}.txt`;

					const writeStream = createWriteStream(
						pathFile, 
						{ encoding: "utf-8" }
					);

					Object.entries(user).forEach(([key, value]) => {
						writeStream.write(`${key} : ${JSON.stringify(value)}\n`);
					});

					writeStream.write("\n");

					const commandGenerator = FindSlice(
						10,
						(slice, size) => prisma.command.findMany({
							where: { userId: user.id },
							skip: slice * size,
							take: size,
							include: {
								commandItems: true,
								productReturns: true,
								bundles: {
									include: {
										products: {
											include: {
												product: true,
											}
										}
									}
								}
							}
						}) 
					);

					for await (const command of commandGenerator) {
						writeStream.write(`commanId: ${command.id}`);
						writeStream.write(`commandStatus: ${command.status}`);
						writeStream.write(`commandCreatedAt: ${command.createdAt.toISOString()}`);
						writeStream.write(`commandFirstname: ${command.firstname}`);
						writeStream.write(`commandLastname: ${command.lastname}`);
						writeStream.write(`commandAddress: ${command.address}`);

						writeStream.write("\n");

						command.commandItems.forEach((commandItem) => {
							const fullProductSheet = 
								JSON.parse(commandItem.freezeProductSheet) as FullProductSheetSchema;

							writeStream.write(`\tcommandItemId: ${commandItem.id}`);
							writeStream.write(`\tcommandItemCanceled: ${commandItem.canceled}`);
							writeStream.write(`\tcommandItemQuantity: ${commandItem.quantity}`);
							writeStream.write(`\tcommandItemProcessQuantity: ${commandItem.processQuantity}`);
							writeStream.write(`\tcommandItemProductSheetRef: ${fullProductSheet.ref}`);
							writeStream.write(`\tcommandItemProductSheetId: ${fullProductSheet.id}`);
							writeStream.write(`\tcommandItemProductSheetName: ${fullProductSheet.name}`);
							writeStream.write(`\tcommandItemProductSheetPrice: ${fullProductSheet.price}`);

							if (fullProductSheet.promotion) {
								writeStream.write(`\tcommandItemProductSheetOriginalPrice: ${fullProductSheet.promotion.originalPrice}`);
								writeStream.write(`\tcommandItemProductSheetPromotion: -${fullProductSheet.promotion.originalPrice}%`);
								writeStream.write(`\tcommandItemProductSheetPromotionReason: ${fullProductSheet.promotion.reason}`);
							}

							writeStream.write("\n");
						});

						command.bundles.forEach((bundle) => {
							writeStream.write(`\tbundleId: ${bundle.id}`);
							writeStream.write(`\tbundleIdShip: ${bundle.idShip}`);
							writeStream.write(`\tbundleCreatedAt: ${bundle.createdAt}`);
							writeStream.write(`\tbundleStatus: ${bundle.status}`);
							writeStream.write(`\tbundleCarrierName: ${bundle.carrierName}`);

							writeStream.write("\n");

							bundle.products.map((p) => p.product).forEach(product => {
								writeStream.write(`\t\tproductSku: ${product.sku}`);
								writeStream.write(`\t\tproductProductSheetId: ${product.productSheetId}`);

								writeStream.write("\n");
							});

						});

						command.productReturns.forEach((productReturn) => {
							writeStream.write(`\tproductReturnId: ${productReturn.id}`);
							writeStream.write(`\tproductReturnProductSku: ${productReturn.productSku}`);
							writeStream.write(`\tproductReturnCreatedAt: ${productReturn.createdAt}`);

							writeStream.write("\n");
						});
					}

					writeStream.close();

					Mail.send(
						user.email, 
						"User Data",
						"",
						[{ filename: "data.txt", path: pathFile }]
					).then(() => unlink(pathFile));
				});

				throw new NoContentHttpException("user.pullData");
			},
			new IHaveSentThis(NoContentHttpException.code, "user.pullData")
		); 
