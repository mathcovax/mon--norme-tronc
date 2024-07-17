import { inputProductSheetReview, productSheetReviewExistCheck } from "@checkers/productSheetReview";
import { productSheetReviewModel } from "@mongoose/model";
import { productSheetReviewSchema } from "@schemas/productSheetReview";
import { hasPrimordialRole } from "@security/hasPrimordialRole";

/* METHOD : DELETE, PATH : /product-sheet-reviews/{productSheetReviewId} */
export const DELETE = (method: Methods, path: string) => 
	hasPrimordialRole({ options: { primordialRole: "MODERATOR" } })
		.declareRoute(method, `${path}@moderator`)
		.extract({
			params: {
				productSheetReviewId: zod.string()
			}
		})
		.check(
			productSheetReviewExistCheck,
			{
				input: p => inputProductSheetReview.id(
					p("productSheetReviewId")
				),
				...productSheetReviewExistCheck.preCompletions.mustExist,
			},
			new IHaveSentThis(NotFoundHttpException.code, "productSheetReview.notfound")
		)
		.handler(
			async ({ pickup }) => {
				const productSheetReviewId = pickup("productSheetReviewId");
				
				await productSheetReviewModel.deleteOne({
					_id: productSheetReviewId
				});

				throw new NoContentHttpException("productSheetReview.deleted");
			},
			new IHaveSentThis(NoContentHttpException.code, "productSheetReview.deleted"),
			new SwaggerIgnore(),
		);

/* METHOD : PATCH, PATH : /product-sheet-reviews/{productSheetReviewId} */
export const PATCH = (method: Methods, path: string) => 
	hasPrimordialRole({ options: { primordialRole: "MODERATOR" } })
		.declareRoute(method, path)
		.extract({
			params: {
				productSheetReviewId: zod.string()
			},
			body: zod.object({
				check: zod.boolean().optional()
			}).strip().default({})
		})
		.check(
			productSheetReviewExistCheck,
			{
				input: p => inputProductSheetReview.id(
					p("productSheetReviewId")
				),
				...productSheetReviewExistCheck.preCompletions.mustExist,
			},
			new IHaveSentThis(NotFoundHttpException.code, "productSheetReview.notfound")
		)
		.handler(
			async ({ pickup }) => {
				const productSheetReviewId = pickup("productSheetReviewId");
				const productSheetReview = pickup("productSheetReview");
				const body = pickup("body");
				
				await productSheetReviewModel.updateOne(
					{ _id: productSheetReviewId },
					{ $set: body }
				);

				throw new OkHttpException("productSheetReview.edited", { ...productSheetReview, ...body, _id: productSheetReview._id.toString() });
			},
			new IHaveSentThis(OkHttpException.code, "productSheetReview.edited", productSheetReviewSchema),
		);
