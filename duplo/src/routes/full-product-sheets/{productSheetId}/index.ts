import { fullProductSheetModel } from "@mongoose/model";
import { fullProductSheetSchema } from "@schemas/fullProductSheet";

/* METHOD : GET, PATH : /full-product-sheets/{productSheetId} */
export const GET = (method: Methods, path: string) => 
	duplo
		.declareRoute(method, path)
		.extract({
			params: {
				productSheetId: zod.string()
			}
		})
		.cut(
			async ({ pickup }) => {
				const productSheetId = pickup("productSheetId");
				const fullProductSheet = await fullProductSheetModel.findOne({ id: productSheetId });

				if (!fullProductSheet) {
					throw new NotFoundHttpException("fullProductSheet.notfound");
				}

				return {
					fullProductSheet: fullProductSheet.toJSON()
				};
			},
			["fullProductSheet"],
			new IHaveSentThis(NotFoundHttpException.code, "fullProductSheet.notfound")
		)
		.handler(
			async ({ pickup }) => {
				const fullProductSheet = pickup("fullProductSheet");

				throw new OkHttpException("fullProductSheet", fullProductSheet);
			},
			new IHaveSentThis(OkHttpException.code, "fullProductSheet", fullProductSheetSchema)
		);
