import { inputWarehouse, warehouseExistCheck } from "@checkers/warehouse";
import { organizationCommandCollectionSchema } from "@schemas/organizationCommand";
import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";

/* METHOD : GET, PATH : /organization/{organizationId}/commands */
export const GET = (method: Methods, path: string) => 
	hasOrganizationRoleByOrganizationId({ options: { organizationRole: "STORE_KEEPER" }, pickup: ["organization"] })
		.declareRoute(method, path)
		.extract({
			query: {
				warehouseId: zod.string(),
				page: zod.coerce.number().default(0),
			}
		})
		.check(
			warehouseExistCheck,
			{
				input: p => inputWarehouse.id(
					p("warehouseId")
				),
				...warehouseExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "warehouse.notfound")
		)
		.handler(
			async ({ pickup }) => {
				const { id: organizationId } = pickup("organization");
				const { id: warehouseId } = pickup("warehouse");
				const page = pickup("page");

				const organizationCommandCollection = await prisma.$queryRaw`
					WITH organizationCommandItems ("commandId", quantity) AS (
						SELECT
							ci."commandId" AS "commandId",
							ci.quantity - ci."processQuantity" AS quantity
						FROM
							command_item AS ci
						INNER JOIN product_sheet AS ps ON ps.id = ci."productSheetId"
						WHERE 
							ps."organizationId" = ${organizationId}
							AND ps."warehouseId" = ${warehouseId}
							AND ci.quantity != ci."processQuantity"
					)

					SELECT 
						oci."commandId" AS "commandId",
						SUM(oci.quantity)::INT AS quantity,
						c."createdAt"
					FROM organizationCommandItems AS oci
					INNER JOIN command AS c ON c.id = oci."commandId"
					WHERE c.status = 'IN_PROGRESS'
					GROUP BY oci."commandId", c."createdAt"
					ORDER BY c."createdAt"
					OFFSET ${page * 10}
					LIMIT 10
				` as Zod.infer<typeof organizationCommandCollectionSchema>;

				throw new OkHttpException("organizationCommandCollection", organizationCommandCollection);
			},
			new IHaveSentThis(OkHttpException.code, "organizationCommandCollection", organizationCommandCollectionSchema)
		);
