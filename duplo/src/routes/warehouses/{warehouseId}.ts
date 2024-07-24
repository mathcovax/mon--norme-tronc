import { hasOrganizationRoleByWarehouseId } from "@security/hasOrganizationRole/byWarehouseId";
import { addressValidCheck } from "@checkers/address";

/* METHOD : PATCH, PATH : /warehouses/{warehouseId} */
export const PATCH = (method: Methods, path: string) => 
	hasOrganizationRoleByWarehouseId({ pickup: ["warehouse"] })
		.declareRoute(method, path)
		.extract({
			body: zod.object({
				name: zod.string().min(3).max(255).optional(),
				address: zod.string().optional(),
			}).strip().default({}),
		})
		.check(
			addressValidCheck,
			{
				input: p => p("body").address ?? "",
				result: "address.valid",
				catch: () => {
					throw new BadRequestHttpException("warehouse.address.invalid");
				},
				skip: p => !p("body").address
			},
			new IHaveSentThis(BadRequestHttpException.code, "warehouse.address.invalid")
		)
		.handler(
			async ({ pickup }) => {
				const { id: warehouseId } = pickup("warehouse");
				const { name, address } = pickup("body");

				await prisma.warehouse.update({
					where: {
						id: warehouseId
					},
					data: {
						name,
						address
					}
				});
				throw new OkHttpException("warehouse.edited");
			},
			new IHaveSentThis(OkHttpException.code, "warehouse.edited")
		);
