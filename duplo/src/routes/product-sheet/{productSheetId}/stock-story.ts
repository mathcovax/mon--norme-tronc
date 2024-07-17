import { productStockModel } from "@mongoose/model";
import { productStockSchema } from "@schemas/ProductStock";
import { hasOrganizationRoleByProductSheetId } from "@security/hasOrganizationRole/byProductSheetId";

/* METHOD : GET, PATH : /product-sheet/{productSheetId}/stock-story */
export const GET = (method: Methods, path: string) =>
	hasOrganizationRoleByProductSheetId({ 
		pickup: ["productSheet"], 
		options: { organizationRole: "STORE_KEEPER" }
	})
		.declareRoute(method, path)
		.extract({
			query: {
				startDate: zod.coerce.date().optional().transform(v => v ?? new Date()),
			}
		})
		.handler(
			async ({ pickup }) => {
				const { id: productSheetId } = pickup("productSheet");
				const startDate = pickup("startDate");
				const stockStory = await productStockModel.aggregate([
					{
						$match: {
							productSheetId,
							date: { $gte: startDate }
						}
					},
					{
						$sort: {
							date: 1
						}
					},
				]);

				throw new OkHttpException("product.stockStory", stockStory);
			},
			new IHaveSentThis(OkHttpException.code, "product.stockStory", productStockSchema.array())
		);
		
				
