import { fullProductSheetModel } from "@mongoose/model";
import { fullProductSheetSchema } from "@schemas/fullProductSheet";
import { hasPrimordialRole } from "@security/hasPrimordialRole";

/* METHOD : GET, PATH : /full-product-sheets */
export const GET = (method: Methods, path: string) => 
	hasPrimordialRole({ options: { primordialRole: "MODERATOR" } })
		.declareRoute(method, `${path}@moderator`)
		.handler(
			async () => {
				const fullProductSheets = await fullProductSheetModel.aggregate([
					{ $match: { status: "UNVERIFIED" } },
					{ $sample: { size: 1 } },
				]);

				throw new OkHttpException("fullProductSheets", fullProductSheets);
			},
			new IHaveSentThis(OkHttpException.code, "fullProductSheets", fullProductSheetSchema.array()),
			new SwaggerIgnore(),
		);
