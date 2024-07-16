import { addressValidCheck } from "@checkers/address";
import { fullCommandModel, fullProductSheetModel } from "@mongoose/model";
import { FullCommandSchema } from "@schemas/command";
import { sessionSchema } from "@schemas/session";
import { mustBeConnected } from "@security/mustBeConnected";
import { CartService } from "@services/cart";
import { uuidv7 } from "uuidv7";

/* METHOD : POST, PATH : /make-command */
export const POST = (method: Methods, path: string) => 
	mustBeConnected({ pickup: ["user"] })
		.declareRoute(method, path)
		.extract({
			body: zod.object({
				lastname: zod.string().max(32).toUpperCase(),
				firstname: zod.string().max(36).toLowerCase(),
				address: zod.string().max(400),
			}).strip()
		})
		.check(
			addressValidCheck,
			{
				input: p => p("body").address,
				result: "address.valid",
				catch: () => {
					throw new BadRequestHttpException("user.address.invalid");
				}
			},
			new IHaveSentThis(BadRequestHttpException.code, "user.address.invalid")
		)
		.cut(({ pickup }) => ({ cartService: new CartService(pickup("user").id) }), ["cartService"])
		.cut(
			async ({ pickup }) => {
				const articlesInCart = await pickup("cartService").getArticlesInCart();

				if (articlesInCart.length < 1) {
					throw new ConflictHttpException("cart.empty");
				}

				return { articlesInCart };
			},
			["articlesInCart"],
			new IHaveSentThis(ConflictHttpException.code, "cart.empty"),
		)
		.cut(
			async ({ pickup }) => {
				const articlesAvailable = await pickup("cartService").articlesAvailableInCart();

				if (!articlesAvailable) {
					throw new ConflictHttpException("products.unavailable");
				}
				
				return {};
			},
			[],
			new IHaveSentThis(ConflictHttpException.code, "products.unavailable"),
		)
		.handler(
			async ({ pickup }) => {
				const user = pickup("user");
				const articlesInCart = pickup("articlesInCart");
				const commandId = uuidv7();
				const { firstname, lastname, address } = pickup("body");

				const articlesInCartAndfullProductSheets = await Promise.all(
					articlesInCart.map(
						aic => fullProductSheetModel.findOne({ id: aic.productSheetId })
							.then(fps => {
								if (!fps) {
									throw new Error(`missing full product sheet ${aic.productSheetId}`);
								}

								return fps.toJSON();
							})
							.then(fps => {
								fps.promotion = aic.promotion;
								fps.hasPromotion = !!aic.promotion;
								fps.price = aic.price;

								return [aic, fps] as const;
							})
					)
				);

				const session = await stripe.checkout.sessions.create({
					mode: "payment",
					line_items: articlesInCartAndfullProductSheets.map(
						([aic, fps]) => ({
							price_data: {
								currency: "eur",
								product_data: {
									name: fps.name,
								},
								unit_amount: Number((fps.price * 100).toFixed(0))
							},
							quantity: aic.quantity,
						}),
					),
					invoice_creation: {
						enabled: true,
					},
					success_url: `${ENV.ORIGIN}/order?sessionId={CHECKOUT_SESSION_ID}`,
					cancel_url: `${ENV.ORIGIN}/order?commandId=${commandId}`,
					customer_email: user.email,
					expires_at: Math.floor(Date.now() / 1000) + MetConfig.stripe.timestampSession,
					metadata: {
						commandId,
					},
				});
				
				await prisma.command.create({
					data: {
						id: commandId,
						firstname,
						lastname,
						address,
						userId: user.id,
						stripeSessionId: session.id,
					}
				});

				await Promise.all([
					Promise.all(
						articlesInCartAndfullProductSheets.map(
							([aic, fps]) => prisma.command_item.create({
								data: {
									commandId,
									userId: user.id,
									productSheetId: aic.productSheetId,
									quantity: aic.quantity,
									freezeProductSheet: JSON.stringify(fps),
								}
							}).then(commandItem => [commandItem, fps] as const)
						),
					).then(
						commandItemsAndFps => fullCommandModel.create({
							id: commandId,
							firstname,
							lastname,
							status: "WAITING_PAYMENT",
							userId: user.id,
							deliveryAddress: address,
							createdDate: new Date(),
							price: Number(
								commandItemsAndFps.reduce(
									(pv, [ci, fps]) => pv + (ci.quantity * fps.price), 
									0
								).toFixed(2)
							),
							items: commandItemsAndFps.map(([commandItem, fps]) => ({
								quantity: commandItem.quantity,
								processQuantity: commandItem.processQuantity,
								productSheetId: commandItem.productSheetId,
								productSheetName: fps.name,
								productSheetPrice: fps.price,
								productSheetFirstImageUrl: fps.images[0] ?? "",
								productSheetOrganizationName: fps.organization.name,
							})),
						} satisfies FullCommandSchema)
					),
					prisma.article.deleteMany({
						where: {
							userId: user.id
						}
					})
				]);

				throw new CreatedHttpException("session", { sessionUrl: session.url });
			},
			new IHaveSentThis(CreatedHttpException.code, "session", sessionSchema)
		);
