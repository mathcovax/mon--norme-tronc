import { inputProductSheet, productSheetExistCheck } from "@checkers/productSheet";
import { inputProductSheetReview, productSheetReviewExistCheck } from "@checkers/productSheetReview";
import { productSheetReviewModel } from "@mongoose/model";
import { productSheetReviewSchema } from "@schemas/productSheetReview";
import { mustBeConnected } from "@security/mustBeConnected";

/* METHOD : POST, PATH : /product-sheets/{productSheetId}/reviews */
export const POST = (method: Methods, path: string) => 
	mustBeConnected({ pickup: ["user"] })
		.declareRoute(method, path)
		.extract({
			params: {
				productSheetId: zod.string()
			},
			body: zod.object({
				pseudo: zod.string().min(3).max(30),
				content: zod.string().max(500),
				rate: zod.number().min(1).max(5).int(),
			}).strip()
		})
		.cut(
			({ pickup }) => {
				const user = pickup("user");

				if (user.muted === true) {
					throw new ForbiddenHttpException("user.muted");
				}

				return {};
			},
			[],
			new IHaveSentThis(ForbiddenHttpException.code, "user.muted")
		)
		.check(
			productSheetExistCheck,
			{
				input: p => inputProductSheet.id(p("productSheetId")),
				...productSheetExistCheck.preCompletions.mustExist,
			},
			new IHaveSentThis(NotFoundHttpException.code, "prodcutSheet.notfound")
		)
		.check(
			productSheetReviewExistCheck,
			{
				input: p => inputProductSheetReview.userIdAndProductSheetId({
					userId: p("user").id,
					productSheetId: p("productSheetId"),
				}),
				result: "productSheetReview.notfound",
				catch: () => {
					throw new ConflictHttpException("productSheetReview.alreadyExist");
				}
			},
			new IHaveSentThis(ConflictHttpException.code, "productSheetReview.alreadyExist")
		)
		.handler(
			async ({ pickup }) => {
				const body = pickup("body");
				const user = pickup("user");
				const productSheetId = pickup("productSheetId");
				
				const productSheetReview = await productSheetReviewModel.create({
					userId: user.id,
					productSheetId,
					...body,
					createdAt: new Date(),
					check: false,
				}).then(psr => ({
					...psr.toJSON(),
					_id: psr._id.toString()
				}));



				throw new CreatedHttpException("productSheetReview.created", productSheetReview);
			},
			new IHaveSentThis(CreatedHttpException.code, "productSheetReview.created", productSheetReviewSchema)
		);

/* METHOD : GET, PATH : /product-sheets/{productSheetId}/reviews */
export const GET = (method: Methods, path: string) => 
	duplo
		.declareRoute(method, path)
		.extract({
			params: {
				productSheetId: zod.string()
			},
			query: {
				page: zod.coerce.number().default(0),
				userId: zod.string().optional(),
			}
		})
		.check(
			productSheetExistCheck,
			{
				input: p => inputProductSheet.id(p("productSheetId")),
				...productSheetExistCheck.preCompletions.mustExist,
			},
			new IHaveSentThis(NotFoundHttpException.code, "prodcutSheet.notfound")
		)
		.handler(
			async ({ pickup }) => {
				const productSheetId = pickup("productSheetId");
				const page = pickup("page");
				const userId = pickup("userId");
				
				const productSheetReviews = await productSheetReviewModel.aggregate([
					{ $match: { productSheetId, ...(userId ? { userId } : {}) } },
					{ $sort: { createdAt: -1 } },
					{ $skip: page * MetConfig.productSheet.reviewLimit },
					{ $limit: MetConfig.productSheet.reviewLimit },
					{
						$addFields: {
							_id: {
								$toString: "$_id"
							}
						}
					}
				]);
				
				throw new OkHttpException("productSheetReviews", productSheetReviews);
			},
			new IHaveSentThis(OkHttpException.code, "productSheetReviews", productSheetReviewSchema.array())
		);
