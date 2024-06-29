import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";

/* METHOD : POST, PATH : /organization/{organizationId}/commands/{commandId}/make-bundle */
export const POST = (method: Methods, path: string) => 
	hasOrganizationRoleByOrganizationId({ options: { organizationRole: "STORE_KEEPER" }, pickup: ["organization", "user"] })
		.declareRoute(method, path)
		.extract({
			params: {
				commandId: zod.string()
			},
			body: zod.object({
				idShip: zod.string(),
				bundleItems: zod.object({
					commandItemId: zod.number(),
					sku: zod.string(),
				}).strip().array().min(1),
			})
		})
		.cut(
			async ({ pickup }) => {
				const { bundleItems } = pickup("body");
				const commandId = pickup("commandId");
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
								include: { command: true, productSheet: true }
							}).then((commandItem) => {
								if (!commandItem) {
									throw new NotFoundHttpException("commandItem.missing");
								}

								if (commandItem.quantity === commandItem.processQuantity) {
									throw new ConflictHttpException("commandItem.alreadyCompleted");
								}

								if (commandItem.commandId !== commandId) {
									throw new BadRequestHttpException("commandItem.wrong.commandId");
								}

								return commandItem;
							})
						]).then(([product, commandItemWithMore]) => {
							if (product.productSheetId !== commandItemWithMore.productSheetId) {
								throw new BadRequestHttpException("commandItem.wrong.product");
							}
							const { command, productSheet, ...commandItem } = commandItemWithMore;
							return {
								command, 
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
				const commandId = pickup("commandId");
				const bundleNeededDatas = pickup("bundleNeededDatas");
				const computedProcessQuantity = pickup("computedProcessQuantity");
				const { id: creatorId } = pickup("user");

				const { idShip } = pickup("body");

				const bundle = await prisma.bundle.create({
					data: {
						idShip,
						commandId,
						creatorId,
						status: "created",
					}
				});

				await Promise.all(
					bundleNeededDatas.map(
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
					)
				);

				await Promise.all(
					Object.entries(computedProcessQuantity).map(
						([commandItemId, processQuantity]) => prisma.command_item.update({
							where: { id: Number(commandItemId) },
							data: { processQuantity }
						})
					)
				);

				const commandItems = await prisma.command_item.findMany({
					where: { commandId },
					select: { quantity: true, processQuantity: true },
				});

				if (commandItems.every(commandItem => commandItem.quantity === commandItem.processQuantity)) {
					await prisma.command.update({
						where: { id: commandId },
						data: { status: "DONE" }
					});
				}
				
				throw new OkHttpException("makeBundle");
			},
			new IHaveSentThis(OkHttpException.code, "makeBundle")
		);
