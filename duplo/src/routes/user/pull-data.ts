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
						writeStream.write(`commanId: ${command.id}\n`);
						writeStream.write(`commandStatus: ${command.status}\n`);
						writeStream.write(`commandCreatedAt: ${command.createdAt.toISOString()}\n`);
						writeStream.write(`commandFirstname: ${command.firstname}\n`);
						writeStream.write(`commandLastname: ${command.lastname}\n`);
						writeStream.write(`commandAddress: ${command.address}\n`);

						writeStream.write("\n");

						command.commandItems.forEach((commandItem) => {
							const fullProductSheet = 
								JSON.parse(commandItem.freezeProductSheet) as FullProductSheetSchema;

							writeStream.write(`\tcommandItemId: ${commandItem.id}\n`);
							writeStream.write(`\tcommandItemCanceled: ${commandItem.canceled}\n`);
							writeStream.write(`\tcommandItemQuantity: ${commandItem.quantity}\n`);
							writeStream.write(`\tcommandItemProcessQuantity: ${commandItem.processQuantity}\n`);
							writeStream.write(`\tcommandItemProductSheetRef: ${fullProductSheet.ref}\n`);
							writeStream.write(`\tcommandItemProductSheetId: ${fullProductSheet.id}\n`);
							writeStream.write(`\tcommandItemProductSheetName: ${fullProductSheet.name}\n`);
							writeStream.write(`\tcommandItemProductSheetPrice: ${fullProductSheet.price}\n`);

							if (fullProductSheet.promotion) {
								writeStream.write(`\tcommandItemProductSheetOriginalPrice: ${fullProductSheet.promotion.originalPrice}\n`);
								writeStream.write(`\tcommandItemProductSheetPromotion: -${fullProductSheet.promotion.originalPrice}%\n`);
								writeStream.write(`\tcommandItemProductSheetPromotionReason: ${fullProductSheet.promotion.reason}\n`);
							}

							writeStream.write("\n");
						});

						command.bundles.forEach((bundle) => {
							writeStream.write(`\tbundleId: ${bundle.id}\n`);
							writeStream.write(`\tbundleIdShip: ${bundle.idShip}\n`);
							writeStream.write(`\tbundleCreatedAt: ${bundle.createdAt}\n`);
							writeStream.write(`\tbundleStatus: ${bundle.status}\n`);
							writeStream.write(`\tbundleCarrierName: ${bundle.carrierName}\n`);

							writeStream.write("\n");

							bundle.products.map((p) => p.product).forEach(product => {
								writeStream.write(`\t\tproductSku: ${product.sku}\n`);
								writeStream.write(`\t\tproductProductSheetId: ${product.productSheetId}\n`);

								writeStream.write("\n");
							});

						});

						command.productReturns.forEach((productReturn) => {
							writeStream.write(`\tproductReturnId: ${productReturn.id}\n`);
							writeStream.write(`\tproductReturnProductSku: ${productReturn.productSku}\n`);
							writeStream.write(`\tproductReturnCreatedAt: ${productReturn.createdAt}\n`);

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
