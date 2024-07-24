import { productSchema, productStatusEnum } from "@schemas/product";
import { hasOrganizationRoleBySku } from "@security/hasOrganizationRole/bySku";
import { productEntityformater, productSelect } from "@utils/prisma/product";

/* METHOD : PATCH, PATH : /products/{sku} */
export const PATCH = (method: Methods, path: string) =>
	hasOrganizationRoleBySku({ pickup: ["product"] })
		.declareRoute(method, path)
		.extract({
			body: zod.object({
				status: zod.enum([
					productStatusEnum.IN_STOCK, 
					productStatusEnum.WRONG
				]).optional(),
			}).strip().default({}),
		})
		.handler(
			async ({ pickup }) => {
				const { sku: productSku } = pickup("product");
				const { status } = pickup("body");

				const product = await prisma.product.update({
					where: {
						sku: productSku
					},
					data: {
						status,
					},
					select: productSelect,
				}).then(productEntityformater);

				throw new OkHttpException("product.edited", product);
			},
			new IHaveSentThis(OkHttpException.code, "product.edited", productSchema)
		);
