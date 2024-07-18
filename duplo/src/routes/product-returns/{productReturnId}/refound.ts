import { FullProductSheetSchema } from "@schemas/fullProductSheet";
import { productReturnStatusEnum } from "@schemas/productReturn";
import { hasOrganizationRoleByProductReturnId } from "@security/hasOrganizationRole/byProductReturnId";
import { formatPrice } from "@utils/formatPrice";

/* METHOD : POST, PATH : /product-returns/{productReturnId}/refound */
export const POST = (method: Methods, path: string) => 
	hasOrganizationRoleByProductReturnId({ pickup: ["productReturn"] })
		.declareRoute(method, path)
		.cut(
			({ pickup }) => {
				const productReturn = pickup("productReturn");

				if (productReturn.status === productReturnStatusEnum.REFUNDED) {
					throw new NotAcceptableHttpException("productReturn.wrong.status");
				}

				return {};
			},
			[],
			new IHaveSentThis(NotAcceptableHttpException.code, "productReturn.wrong.status")
		)
		.handler(
			async ({ pickup }) => {
				const productReturn = pickup("productReturn");

				const [product, command] = await Promise.all([
					prisma.product.findUniqueOrThrow({
						where: { sku: productReturn.productSku },
					}),
					prisma.command.findUniqueOrThrow({
						where: { id: productReturn.commandId }
					})
				]);

				const { price: unitPrice } = await prisma.command_item.findFirstOrThrow({
					where: {
						productSheetId: product.productSheetId,
						commandId: command.id,
					},
					select: {
						freezeProductSheet: true
					}
				}).then(
					({ freezeProductSheet }) => JSON.parse(freezeProductSheet) as FullProductSheetSchema
				).catch(() => {
					throw new Error("Error freezeProductSheet");
				});

				const paymentIntent = await stripe.checkout.sessions
					.retrieve(command.stripeSessionId)
					.then(session => {
						if (typeof session.payment_intent !== "string") {
							throw new Error("Error with paymentIntent");
						}
						return session.payment_intent;
					});

				await stripe.refunds.create({
					amount: formatPrice(unitPrice * 100),
					payment_intent: paymentIntent
				});
					
				await Promise.all([
					prisma.product_return.update({
						where: {
							id: productReturn.id,
						},
						data: {
							status: "REFUNDED"
						}
					}),
					prisma.product.update({
						where: {
							sku: productReturn.productSku,
						},
						data: {
							status: "WRONG",
						}
					})
				]);

				throw new NoContentHttpException("product.refound");
			},
			new IHaveSentThis(NoContentHttpException.code, "product.refound"),
		);
