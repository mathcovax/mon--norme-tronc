import { productSheetSchema } from "@schemas/productSheet";
import { hasOrganizationRoleByProductSheetId } from "@security/hasOrganizationRole/byProductSheetId";

/* METHOD : PATCH, PATH : /product-sheet/{productSheetId} */
export const PATCH = (method: Methods, path: string) =>
	hasOrganizationRoleByProductSheetId({ pickup: ["productSheet"] })
		.declareRoute(method, path)
		.extract({
			body: zod.object({
				name: zod.string().min(3).max(255).optional(),
				description: zod.string().optional(),
				shortDescription: zod.string().min(3).max(255).optional(),
				price: zod.number().min(0.01).optional(),
				warehouseId: zod.string().optional(),
			}).strip().default({}),
		})
		.handler(
			async ({ pickup }) => {
				const { id: productSheetId } = pickup("productSheet");
				const { name, description, shortDescription, price, warehouseId } = pickup("body");
				const productSheet = await prisma.product_sheet.update({
					where: {
						id: productSheetId,
					},
					data: {
						name,
						description,
						shortDescription,
						price,
						warehouseId,
						status: "UNVERIFIED",
					},
				});
				throw new CreatedHttpException("productSheet.edited", productSheet);
			},
			new IHaveSentThis(CreatedHttpException.code, "productSheet.edited", productSheetSchema)
		);

/* METHOD : GET, PATH : /product-sheet/{productSheetId} */
export const GET = (method: Methods, path: string) =>
	hasOrganizationRoleByProductSheetId({ pickup: ["productSheet"] })
		.declareRoute(method, path)
		.handler(
			async ({ pickup }) => {
				const productSheet = pickup("productSheet");

				throw new OkHttpException("productSheet.found", productSheet);
			},
			new IHaveSentThis(OkHttpException.code, "productSheet.found", productSheetSchema)
		);

