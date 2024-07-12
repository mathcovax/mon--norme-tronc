import { inputWarehouse, warehouseExistCheck } from "@checkers/warehouse";
import { productSheetSchema } from "@schemas/productSheet";
import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";

/* METHOD : POST, PATH : /organization/{organizationId}/product-sheet */
export const POST = (method: Methods, path: string) =>
	hasOrganizationRoleByOrganizationId({ 
		options: { organizationRole: "PRODUCT_SHEET_MANAGER" }, 
		pickup: ["organization"] 
	})
		.declareRoute(method, path)
		.extract({
			body: zod.object({
				ref: zod.string().min(5).max(20),
				name: zod.string().min(3).max(255),
				description: zod.string(),
				shortDescription: zod.string().min(3).max(255),
				price: zod.number().min(0.01),
				warehouseId: zod.string(),
			}).strip(),
		})
		.check(
			warehouseExistCheck,
			{
				input: (p) => inputWarehouse.id(p("body").warehouseId),
				...warehouseExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "warehouse.notfound")
		)
		.cut(
			async ({ pickup }) => {
				const { id: organizationId } = pickup("organization");
				const { ref } = pickup("body");

				const productSheetWithSameRef = await prisma.product_sheet.count({
					where: {
						organizationId,
						ref,
					}
				});

				if (productSheetWithSameRef) {
					throw new ConflictHttpException("productSheet.ref.alreadyUse");
				}
				
				return {};
			},
			[],
			new IHaveSentThis(ConflictHttpException.code, "productSheet.ref.alreadyUse")
		)
		.handler(
			async ({ pickup }) => {
				const { name, description, shortDescription, price, warehouseId, ref } = pickup("body");
				const { id: organizationId } = pickup("organization");

				const productSheet = await prisma.product_sheet.create({
					data: {
						ref,
						name,
						description,
						shortDescription,
						price,
						warehouseId,
						organizationId,
					},
				});

				throw new CreatedHttpException("productSheet.created", productSheet);
			}, 
			new IHaveSentThis(CreatedHttpException.code, "productSheet.created", productSheetSchema)
		);
