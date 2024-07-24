import { buffer } from "stream/consumers";

/* METHOD : POST, PATH : /stripe-webhook/checkout */
export const POST = (method: Methods, path: string) => 
	duplo
		.declareRoute(method, path)
		.extract({
			headers: {
				"stripe-signature": zod.string()
			},
		})
		.cut(
			async ({ pickup }, res, req) => {
				const stripeSignature = pickup("stripe-signature");
				const signedBody = await buffer(req.rawRequest);
	
				try {
					const stripeEvent = await stripe.webhooks.constructEventAsync(
						signedBody,
						stripeSignature,
						ENV.STRIPE_API_KEY
					);
					return { stripeEvent };
				} catch (err) {
					throw new UnauthorizedHttpException("stripeSignature.invalide");
				}
			},
			["stripeEvent"],
			new IHaveSentThis(UnauthorizedHttpException.code, "stripeSignature.invalide")
		)
		.cut(
			({ pickup }) => {
				const stripeEvent = pickup("stripeEvent");

				if (
					stripeEvent.type !== "checkout.session.completed" &&
					stripeEvent.type !== "checkout.session.expired" 
				) {
					throw new BadRequestHttpException("stripeEvent.invalide.type");
				}

				return { stripeEvent };
			},
			["stripeEvent"],
			new IHaveSentThis(BadRequestHttpException.code, "stripeEvent.invalide.type")
		)
		.cut(
			({ pickup }) => {
				const stripeEvent = pickup("stripeEvent");
				const commandId = stripeEvent.data.object.metadata?.commandId;

				if (typeof commandId !== "string") {
					throw new BadRequestHttpException("stripeEvent.missing.commandId");
				}

				return { commandId };
			},
			["commandId"],
			new IHaveSentThis(BadRequestHttpException.code, "stripeEvent.missing.commandId")
		)
		.handler(
			async ({ pickup }) => {
				const stripeEvent = pickup("stripeEvent");
				const commandId = pickup("commandId");

				await prisma.stripe_notification_checkout.create({
					data: {
						type: stripeEvent.type,
						stripeSessionId: stripeEvent.data.object.id,
						commandId
					}
				});

				throw new CreatedHttpException("webhook.success");
			},
			new IHaveSentThis(CreatedHttpException.code, "webhook.success")
		);
