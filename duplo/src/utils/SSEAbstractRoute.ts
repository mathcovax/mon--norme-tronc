import { Request } from "@duplojs/duplojs";

interface StreamRequest extends Request {
	_onStart?: () => void
}

export const SSEAbstractRoute =
	duplo
		.declareAbstractRoute<StreamRequest>("SSE")
		.hook(
			"beforeSend", 
			(req, res) => {
				if (res.status === 200 && res.information?.includes("stream")) {
					res.setHeaders({
						"Content-Type": "text/event-stream",
						Connection: "keep-alive",
						"Cache-Control": "no-cache"
					});
					res.keepAlive = true;
				}
			}
		)
		.hook(
			"afterSend",
			(req, res) => {
				if (res.keepAlive === true) {
					req._onStart?.();
				}
			}
		)
		.cut(
			(floor, res, req) => {
				const SSE = {
					write: (value: string) => res.rawResponse.write(`data: ${value}\n\n`),
					onClose: (callBack: () => void) => {
						req.rawRequest.on("close", callBack);
					},
					onStart: (callBack: () => void) => {
						req._onStart = callBack;
					},
					close: () => res.rawResponse.end()
				};

				return { SSE };
			},
			["SSE"]
		)
		.build(["SSE"]);
