import { warehouseSchema } from "@schemas/warehouseSchema";
import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";
import { addressValidCheck } from "@checkers/address";

/* METHOD : POST, PATH : /organization/{organizationId}/warehouse */
export const POST = (method: Methods, path: string) =>
	hasOrganizationRoleByOrganizationId({ 
		pickup: ["organization"],
		options: { organizationRole: "BELONG_TO" },
	})
		.declareRoute(method, path)
		.extract({
			body: zod.object({
				name: zod.string().min(2).max(255),
				address: zod.string(),
			}).strip(),
		})
		.check(
			addressValidCheck,
			{
				input: p => p("body").address,
				result: "address.valid",
				catch: () => {
					throw new BadRequestHttpException("warehouse.address.invalid");
				},
			},
			new IHaveSentThis(BadRequestHttpException.code, "warehouse.address.invalid")
		)
		.handler(
			async ({ pickup }) => {
				const { id: organizationId } = pickup("organization");
				const { name, address } = pickup("body");

				const warehouse = await prisma.warehouse.create({
					data: {
						name,
						address,
						organizationId
					},
				});

				throw new CreatedHttpException("warehouse.created", warehouse);
			},
			new IHaveSentThis(CreatedHttpException.code, "warehouse.created", warehouseSchema)
		);
