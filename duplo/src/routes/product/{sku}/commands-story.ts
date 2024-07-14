import { fullCommandModel } from "@mongoose/model";
import { fullCommandSchema } from "@schemas/command";
import { hasOrganizationRoleBySku } from "@security/hasOrganizationRole/bySku";

/* METHOD : GET, PATH : /product/{sku}/commands-story */
export const GET = (method: Methods, path: string) => 
	hasOrganizationRoleBySku({ pickup: ["product"] })
		.declareRoute(method, path)
		.handler(
			async ({ pickup }) => {
				const product = pickup("product");

				const fullCommands = await prisma.product_to_bundle.findMany({
					where: {
						productSku: product.sku
					},
					select: {
						bundle: {
							select: {
								commandId: true
							}
						}
					},
					orderBy: {
						createdAt: "desc"
					}
				}).then(
					ptbs => Promise.all(
						ptbs.map(
							ptb => fullCommandModel
								.findOne({ id: ptb.bundle.commandId })
								.then(fullCommand => {
									if (!fullCommand) {
										throw new Error("missing fullCommand");
									}

									return fullCommand.toJSON();
								})
						)
					)
				);

				throw new OkHttpException("product.commandHistory", fullCommands);
			},
			new IHaveSentThis(OkHttpException.code, "product.commandHistory", fullCommandSchema.array())
		);
