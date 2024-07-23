import { warehouseSchema } from "@schemas/warehouseSchema";
import { hasOrganizationRoleByProductSheetId } from "@security/hasOrganizationRole/byProductSheetId";

/* METHOD : GET, PATH : /product-sheets/{productSheetId}/warehouse */
export const GET = (method: Methods, path: string) => 
	hasOrganizationRoleByProductSheetId({ pickup: ["productSheet"] })
		.declareRoute(method, path)
		.handler(
			async ({ pickup }) => {
				const { warehouseId } = pickup("productSheet");

				const warehouse = await prisma.warehouse.findUniqueOrThrow({
					where: {
						id: warehouseId
					}
				});

				throw new OkHttpException("productSheet.warehouse", warehouse);
			},
			new IHaveSentThis(OkHttpException.code, "productSheet.warehouse", warehouseSchema)
		);
