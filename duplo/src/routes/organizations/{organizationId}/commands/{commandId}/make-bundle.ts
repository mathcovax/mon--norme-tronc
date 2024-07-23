import { bundleCreatedTemplate } from "@/templates/bundle/created";
import { commandExistCheck } from "@checkers/command";
import { fullCommandModel } from "@mongoose/model";
import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";
import { Mail } from "@services/mail";

/* METHOD : POST, PATH : /organizations/{organizationId}/commands/{commandId}/make-bundle */
export const POST = (method: Methods, path: string) => 
	hasOrganizationRoleByOrganizationId({ options: { organizationRole: "STORE_KEEPER" }, pickup: ["organization", "user"] })
		.declareRoute(method, path)
		.extract({
			params: {
				commandId: zod.string()
			},
			body: zod.object({
				idShip: zod.string().min(11).max(15),
				bundleItems: zod.object({
					commandItemId: zod.number(),
					sku: zod.string(),
				}).strip().array().min(1),
			})
		})
		.check(
			commandExistCheck,
			{
				input: p => p("commandId"),
				...commandExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "command.notfound")
		)
		.cut(
			async ({ pickup }) => {
				const { bundleItems } = pickup("body");
				const command = pickup("command");
				const { id: organizationId } = pickup("organization");

				const bundleNeededDatas = await Promise.all(
					bundleItems.map(
						bundleItem =>  Promise.all([
							prisma.product.findUnique({
								where: { sku: bundleItem.sku, status: "IN_STOCK" }
							}).then((product) => {
								if (!product) {
									throw new NotFoundHttpException("product.missing");
								}

								if (product.organizationId !== organizationId) {
									throw new BadRequestHttpException("organization.wrong.product");
								}

								return product;
							}),
							prisma.command_item.findUnique({
								where: { id: bundleItem.commandItemId },
								include: { productSheet: true }
							}).then((commandItem) => {
								if (!commandItem) {
									throw new NotFoundHttpException("commandItem.missing");
								}

								if (commandItem.quantity === commandItem.processQuantity) {
									throw new ConflictHttpException("commandItem.alreadyCompleted");
								}

								if (commandItem.commandId !== command.id) {
									throw new BadRequestHttpException("commandItem.wrong.commandId");
								}

								return commandItem;
							})
						]).then(([product, commandItemWithMore]) => {
							if (product.productSheetId !== commandItemWithMore.productSheetId) {
								throw new BadRequestHttpException("commandItem.wrong.product");
							}
							const { productSheet, ...commandItem } = commandItemWithMore;
							return {
								productSheet, 
								commandItem, 
								product
							};
						})
					)
				);

				return { bundleNeededDatas };
			},
			["bundleNeededDatas"],
			new IHaveSentThis(BadRequestHttpException.code, ["commandItem.wrong.product", "organization.wrong.product", "commandItem.wrong.commandId"]),
			new IHaveSentThis(NotFoundHttpException.code, ["commandItem.missing", "product.missing"]),
			new IHaveSentThis(ConflictHttpException.code, "commandItem.alreadyCompleted"),
		)
		.cut(
			({ pickup }) => {
				const bundleNeededDatas = pickup("bundleNeededDatas");

				const computedProcessQuantity = bundleNeededDatas.reduce<Record<string, number>>(
					(pv, cv) => {
						if (pv[cv.commandItem.id] === undefined) {
							pv[cv.commandItem.id] = cv.commandItem.processQuantity;
						}

						pv[cv.commandItem.id]++;

						if (pv[cv.commandItem.id] > cv.commandItem.quantity) {
							throw new ConflictHttpException("commandItem.tooMuch.product");
						}

						return pv;
					},
					{}
				);

				return { computedProcessQuantity };
			},
			["computedProcessQuantity"],
			new IHaveSentThis(ConflictHttpException.code, "commandItem.tooMuch.product"),
		)
		.handler(
			async ({ pickup }) => {
				const command = pickup("command");
				const bundleNeededDatas = pickup("bundleNeededDatas");
				const computedProcessQuantity = pickup("computedProcessQuantity");
				const { id: creatorId } = pickup("user");

				const { idShip } = pickup("body");

				const bundle = await prisma.bundle.create({
					data: {
						idShip,
						creatorId,
						userId: command.userId,
						commandId: command.id,
						carrierName: "LA_POSTE",
					}
				});

				await Promise.all([
					...bundleNeededDatas.map(
						bnd => Promise.all([
							prisma.product.update({
								where: { sku: bnd.product.sku },
								data: { status: "SOLD" },
							}),
							prisma.product_to_bundle.create({
								data: {
									bundleId: bundle.id,
									productSku: bnd.product.sku
								}
							})
						])
					),
					...Object.entries(computedProcessQuantity).map(
						([commandItemId, processQuantity]) => 
							prisma.command_item.update({
								where: { id: Number(commandItemId) },
								data: { processQuantity }
							})
					),
					prisma.user.findFirstOrThrow({
						where: {
							id: command.userId
						}
					}).then(
						user => Mail.send(
							user.email,
							`Votre colis n°${bundle.idShip} à bien été créée !`,
							bundleCreatedTemplate(
								user.firstname,
								bundle.idShip,
								command.id,
								`${ENV.ORIGIN}/bundle/${bundle.id}`
							)
						)
					).catch(console.log),
				]);

				const commandItems = await prisma.command_item.findMany({
					where: { commandId: command.id },
					select: { productSheetId: true, quantity: true, processQuantity: true },
				});

				await fullCommandModel.findOne({ id: command.id })
					.then(fcm => {
						if (!fcm) {
							throw new Error("Missing full commad");
						}
						return fcm.toJSON();
					})
					.then(
						fullCommand => fullCommandModel.updateOne(
							{ id: command.id },
							{
								$set: {
									items: fullCommand.items.map(
										item => {
											const ci = commandItems.find(
												ci => ci.productSheetId === item.productSheetId
											);

											if (!ci) {
												throw new Error("Missing command");
											}

											return {
												...item,
												processQuantity: ci.processQuantity,
											};
										}
									)
								}
							}
						)
					);

				if (commandItems.every(commandItem => commandItem.quantity === commandItem.processQuantity)) {
					await Promise.all([
						prisma.command.update({
							where: { id: command.id },
							data: { status: "IN_DELIVERY" }
						}),
						fullCommandModel.updateOne(
							{ id: command.id },
							{ status: "IN_DELIVERY" }
						)
					]);
				}
				
				throw new OkHttpException("makeBundle");
			},
			new IHaveSentThis(OkHttpException.code, "makeBundle")
		);
