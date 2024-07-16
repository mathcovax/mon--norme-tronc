import { userBelongsCommand } from "@security/userBelongsCommand";

/* METHOD : GET, PATH : /commands/{commandId}/invoice */
export const GET = (method: Methods, path: string) =>
	userBelongsCommand({ pickup: ["command"] })
		.declareRoute(method, path)
		.handler(
			async ({ pickup }) => {
				const command = pickup("command");
				
				const checkoutSession = await stripe.checkout.sessions.retrieve(command.stripeSessionId);

				if (typeof checkoutSession.invoice !== "string") {
					throw new Error("Missing invoice ID");
				}

				const invoice = await stripe.invoices.retrieve(checkoutSession.invoice);

				if (typeof invoice.invoice_pdf !== "string") {
					throw new Error("Missing invoice pdf");
				}

				throw new OkHttpException("command.invoice", invoice.invoice_pdf);
			},
			new IHaveSentThis(OkHttpException.code, "command.invoice", zod.string())
		);
