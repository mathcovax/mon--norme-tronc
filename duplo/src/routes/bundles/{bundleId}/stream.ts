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
					const interval = setInterval(
						() => {
							LaPosteCarrier
								.updateBundled(bundle)
								.then(updatedBundle => {
									if (updatedBundle.status !== bundle.status) {
										SSE.write(updatedBundle.status);
									}
								});
						},
						MetConfig.bundle.pullingInterval
					);
					SSE.onClose(() => clearInterval(interval));
				});

				throw new OkHttpException("bundle.status.stream");
			},
			new IHaveSentThis(OkHttpException.code, "bundle.status.stream")
		);
