import { productExistCheck } from "@checkers/product";
import { productSchema } from "@schemas/product";
import { hasOrganizationRoleByProductSheetId } from "@security/hasOrganizationRole/byProductSheetId";
import { productEntityformater, productSelect } from "@utils/prisma/product";

/* METHOD : POST, PATH : /product-sheets/{productSheetId}/products */
export const POST = (method: Methods, path: string) =>
	hasOrganizationRoleByProductSheetId({
		options: { organizationRole: "STORE_KEEPER" },  
		pickup: ["productSheet"] 
	})
		.declareRoute(method, path)
		.extract({
			body: zod.object({
				sku: zod.string().min(2).max(255)
			}).strip(),
		})
		.check(
			productExistCheck,
			{
				input: (p) => p("body").sku,
				result: "product.notfound",
				catch: () => {
					throw new ConflictHttpException("product.sku.alreadyUse");
				}
			},
			new IHaveSentThis(ConflictHttpException.code, "product.sku.alreadyUse")
		)
		.handler(
			async ({ pickup }) => {
				const { id: productSheetId, organizationId } = pickup("productSheet");
				const { sku } = pickup("body");

				const product = await prisma.product.create({
					data: {
						sku,
						productSheetId,
						organizationId,
					},
					select: productSelect
				}).then(productEntityformater);

				throw new CreatedHttpException("product.created", product);
			},
			new IHaveSentThis(CreatedHttpException.code, "product.created", productSchema)
		);
