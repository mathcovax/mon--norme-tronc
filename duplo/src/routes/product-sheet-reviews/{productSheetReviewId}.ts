import { inputProductSheetReview, productSheetReviewExistCheck } from "@checkers/productSheetReview";
import { productSheetReviewModel } from "@mongoose/model";
import { mustBeConnected } from "@security/mustBeConnected";

/* METHOD : DELETE, PATH : /product-sheet-reviews/{productSheetReviewId} */
export const DELETE = (method: Methods, path: string) => 
	mustBeConnected({ pickup: ["user"] })
		.declareRoute(method, path)
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
		.cut(
			async ({ pickup }) => {
				const { userId } = pickup("productSheetReview");
				const user = pickup("user");

				if (userId !== user.id) {
					throw new ForbiddenHttpException("productSheetReview.wrong.user");
				}

				return {};
			},
			[],
			new IHaveSentThis(ForbiddenHttpException.code, "productSheetReview.wrong.user")
		)
		.handler(
			async ({ pickup }) => {
				const productSheetReviewId = pickup("productSheetReviewId");
				
				await productSheetReviewModel.deleteOne({
					_id: productSheetReviewId
				});

				throw new NoContentHttpException("productSheetReview.deleted");
			},
			new IHaveSentThis(NoContentHttpException.code, "productSheetReview.deleted")
		);
