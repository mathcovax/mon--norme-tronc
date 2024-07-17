import { productSheetReviewModel } from "@mongoose/model";
import { productSheetReviewSchema } from "@schemas/productSheetReview";
import { hasPrimordialRole } from "@security/hasPrimordialRole";
import { stringBoolean } from "@utils/zod";

/* METHOD : GET, PATH : /product-sheet-reviews */
export const GET = (method: Methods, path: string) => 
	hasPrimordialRole({ options: { primordialRole: "MODERATOR" } })
		.declareRoute(method, path)
		.extract({
			query: {
				random: stringBoolean.optional(),
				check: stringBoolean.optional(),
				page: zod.coerce.number().optional(),
				take: zod.coerce.number()
					.max(MetConfig.productSheet.reviewLimit)
					.min(1)
					.default(MetConfig.productSheet.reviewLimit),
				
			}
		})
		.handler(
			async ({ pickup }) => {
				const take = pickup("take");
				const check = pickup("check");
				const random = pickup("random");
				const page = pickup("page");

				const productSheetReview = await productSheetReviewModel.aggregate([
					...(check !== undefined ? [{ $match: { check } }] : []),
					...(random ? [{ $sample: { size: take } }] : []),
					...(page ? [{ $skip: page * take }] : []),
					{ $limit: take },
					{
						$addFields: {
							_id: {
								$toString: "$_id"
							}
						}
					},
				]);

				throw new OkHttpException("productSheetReviews", productSheetReview);
			},
			new IHaveSentThis(OkHttpException.code, "productSheetReviews", productSheetReviewSchema.array())
		);
