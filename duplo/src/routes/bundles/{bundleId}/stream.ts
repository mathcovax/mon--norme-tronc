import { userBelongsBundle } from "@security/userBelongsBundle";
import { LaPosteCarrier } from "@services/carriers/laPost";
import { SSEAbstractRoute } from "@utils/SSEAbstractRoute";


/* METHOD : GET, PATH : /bundles/{bundleId}/stream */
export const GET = (method: Methods, path: string) => 
	duplo
		.mergeAbstractRoute([
			userBelongsBundle({ pickup: ["bundle"] }),
			SSEAbstractRoute({ pickup: ["SSE"] })
		])
		.declareRoute(method, path)
		.handler(
			({ pickup }) => {
				const SSE = pickup("SSE");
				const bundle = pickup("bundle");

				SSE.onStart(() => {
					const intervalCallback = async () => {
						let lastTimeLineSend: string;
						await LaPosteCarrier
							.fetchDetails(bundle.idShip)
							.then(details => {
								const lastTimeline = details.timeline.pop()?.shortLabel;
								if (lastTimeline && lastTimeLineSend !== lastTimeline) {
									return SSE.write(lastTimeLineSend = lastTimeline);
								}
							});
					};

					const interval = setInterval(
						intervalCallback,
						MetConfig.bundle.pullingInterval
					);
					
					SSE.onClose(() => {
						clearInterval(interval);
					});

					intervalCallback();
				});

				throw new OkHttpException("bundle.status.stream");
			},
			new IHaveSentThis(OkHttpException.code, "bundle.status.stream")
		);
