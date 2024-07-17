import { createTypeInput, GetTypeInput } from "@duplojs/type-input";
import { productSheetReviewModel } from "@mongoose/model";

interface Input {
	userId: string
	productSheetId: string
}

export const inputProductSheetReview = createTypeInput()
	.add<"id", string>()
	.add<"userIdAndProductSheetId", Input>()
	.build();

export const productSheetReviewExistCheck = duplo
	.createChecker("productSheetReviewExist")
	.handler(async ({ name, value }: GetTypeInput<typeof inputProductSheetReview>, output) => {

		let where: Parameters<typeof productSheetReviewModel["findOne"]>[0];

		if (name === "id") {
			where = { _id: value };
		}
		else {
			where = value;
		}

		const productSheetReview = await productSheetReviewModel.findOne(where);

		if (productSheetReview) {
			return output("productSheetReview.exist", productSheetReview.toJSON());
		}
		else {
			return output("productSheetReview.notfound", null);
		}
	})
	.preCompletion(
		"mustExist",
		{
			result: "productSheetReview.exist",
			catch: () => {
				throw new NotFoundHttpException("productSheetReview.notfound");
			},
			indexing: "productSheetReview",
		}
	)
	.build();
