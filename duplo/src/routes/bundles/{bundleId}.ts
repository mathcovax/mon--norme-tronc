import { BundleSchema, bundleSchema } from "@schemas/bundle";
import { userBelongsBundle } from "@security/userBelongsBundle";

/* METHOD : GET, PATH : /bundles/{bundleId} */
export const GET = (method: Methods, path: string) => 
	userBelongsBundle({ pickup: ["bundle"] })
		.declareRoute(method, path)
		.handler(
			async ({ pickup }) => {
				const bundleEntity = pickup("bundle");

				const bundleProducts = await prisma.$queryRaw<BundleSchema["bundleProducts"]>`
					WITH productQuantity AS (
						SELECT 
							p."productSheetId" AS "productSheetId",
							CAST(COUNT(*) AS INTEGER) AS quantity 
						FROM product_to_bundle AS ptb
						INNER JOIN product AS p ON p.sku = ptb."productSku"
						WHERE "bundleId" = ${bundleEntity.id}
						GROUP BY p."productSheetId"
					), productSheetImage AS (
						SELECT
							psi."productSheetId" AS "productSheetId",
							url AS "imageUrl",
							ROW_NUMBER() OVER ( PARTITION BY psi."productSheetId" ORDER BY psi."id" DESC ) AS "rowNumber"
						FROM productQuantity AS pq 
						INNER JOIN image_product_sheet AS psi ON psi."productSheetId" = pq."productSheetId"
					)

					SELECT
						pq."productSheetId" AS "productSheetId",
						pq.quantity AS quantity,
						ps.name AS name,
						COALESCE((psi."imageUrl"), '') AS "imageUrl"
					FROM productQuantity AS pq
					INNER JOIN product_sheet AS ps ON ps."id" = pq."productSheetId"
					LEFT JOIN productSheetImage AS psi ON psi."rowNumber" = 1 AND psi."productSheetId" = pq."productSheetId"
				`;

				const bundle: BundleSchema = {
					idShip: bundleEntity.idShip,
					bundleProducts: bundleProducts,
				};

				throw new OkHttpException("bundle", bundle);
			},
			new IHaveSentThis(OkHttpException.code, "bundle", bundleSchema)
		);
