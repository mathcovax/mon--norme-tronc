import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";
import { warehouseSchema } from "@schemas/warehouseSchema";
import { addressValidCheck } from "@checkers/address";

/* METHOD : GET, PATH : /organizations/{organizationId}/warehouses */
export const GET = (method: Methods, path: string) =>
	hasOrganizationRoleByOrganizationId({ 
		options: { organizationRole: "STORE_KEEPER" }, 
		pickup: ["organization"] 
	})
		.declareRoute(method, path)
		.extract({
			query: {
				page: zod.coerce.number().default(0),
				name: zod.string().optional()
			}
		})
		.handler(
			async ({ pickup }) => {
				const { id: organizationId } = pickup("organization");
				const page = pickup("page");
				const name = pickup("name");

				const warehouse = await prisma.warehouse.findMany({
					where: {
						organizationId,
						name: name
							? {
								contains: name,
								mode: "insensitive"
							}
							: undefined
					},
					take: 10,
					skip: page * 10
				});
				throw new OkHttpException("warehouses.found", warehouse);
			},
			new IHaveSentThis(OkHttpException.code, "warehouses.found", warehouseSchema.array())
		);
		
/* METHOD : POST, PATH : /organizations/{organizationId}/warehouses */
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
		
