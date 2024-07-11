import { bundleSchema } from "@schemas/bundle";
import { userBelongsCommand } from "@security/userBelongsCommand";

/* METHOD : GET, PATH : /commands/{commandId}/bundles */
export const GET = (method: Methods, path: string) =>
	userBelongsCommand({ pickup: ["command"] })
		.declareRoute(method, path)
		.handler(
			async ({ pickup }) => {
				const { id: commandId } = pickup("command");
				const bundles = await prisma.bundle.findMany(
					{
						where: { commandId },
						select: {
							id: true,
							idShip: true,
							carrierName: true,
							commandId: true,
							status: true,
							_count: {
								select: {
									products: true
								}
							},
						}
					}
				).then(
					bundles => bundles.map(
						({ _count, ...bundle }) => 
							({
								...bundle,
								productsCount: _count.products
							})
					)
				);
				
				throw new OkHttpException("bundles.found", bundles);
			},
			new IHaveSentThis(OkHttpException.code, "bundles.found", bundleSchema.array())
		);
