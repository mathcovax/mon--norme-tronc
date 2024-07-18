import { Request, Response } from "@duplojs/duplojs";

interface AfterSendResponse extends Response {
	_afterSend?: () => void
}

export const AfterSendAbstractRoute = 
	duplo
		.declareAbstractRoute<Request, AfterSendResponse>("AfterSend")
		.hook("afterSend", (req, res) => {
			res._afterSend?.();
		})
		.cut(
			(floor, res) => ({
				afterSend: (fnc: () => void) => res._afterSend = fnc
			}),
			["afterSend"]
		)
		.build(["afterSend"]);
