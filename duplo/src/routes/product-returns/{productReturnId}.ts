import { productReturnSchema, productReturnStatusEnum } from "@schemas/productReturn";
import { hasOrganizationRoleByProductReturnId } from "@security/hasOrganizationRole/byProductReturnId";

/* METHOD : PATCH, PATH : /product-returns/{productReturnId} */
export const PATCH = (method: Methods, path: string) => 
	hasOrganizationRoleByProductReturnId({ pickup: ["productReturn"] })
		.declareRoute(method, path)
		.extract({
			body: zod.object({
				productReturnStatus: zod.enum([
					productReturnStatusEnum.INVALID, 
					productReturnStatusEnum.WAITING_RETURN
				]).optional()
			}).strip().default({})
		})
		.cut(
			({ pickup }) => {
				const productReturn = pickup("productReturn");

				if (productReturn.status === productReturnStatusEnum.REFUNDED) {
					throw new NotAcceptableHttpException("productReturn.wrong.status");
				}

				return {};
			},
			[],
			new IHaveSentThis(NotAcceptableHttpException.code, "productReturn.wrong.status")
		)
		.handler(
			async ({ pickup }) => {
				const productReturn = pickup("productReturn");
				const { productReturnStatus } = pickup("body");

				const editedProductReturn = await prisma.product_return.update({
					where: {
						id: productReturn.id,
					},
					data: {
						status: productReturnStatus
					}
				});

				throw new OkHttpException("productReturn.edited", editedProductReturn);
			},
			new IHaveSentThis(OkHttpException.code, "productReturn.edited", productReturnSchema)
		);
