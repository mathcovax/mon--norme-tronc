import { inputProductSheet, productSheetExistCheck } from "@checkers/productSheet";
import { fullProductSheetModel } from "@mongoose/model";
import { productSheetSchema, productSheetStatusTuple } from "@schemas/productSheet";
import { hasPrimordialRole } from "@security/hasPrimordialRole";

/* METHOD : PATCH, PATH : /product-sheet/{productSheetId} */
export const PATCH = (method: Methods, path: string) =>
	hasPrimordialRole({ options: { primordialRole: "MODERATOR" } })
		.declareRoute(method, `${path}@moderator`)
		.extract({
			params: {
				productSheetId: zod.string(),
			},
			body: zod.object({
				status: zod.enum(productSheetStatusTuple).optional()
			}).strip().default({}),
		})
		.check(
			productSheetExistCheck,
			{
				input: (p) => inputProductSheet.id(p("productSheetId")),
				...productSheetExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "productSheet.notfound")
		)
		.handler(
			async ({ pickup }) => {
				const { id: productSheetId } = pickup("productSheet");
				const { status } = pickup("body");

				const productSheet = await prisma.product_sheet.update({
					where: {
						id: productSheetId,
					},
					data: {
						status,
					},
				});

				if (status === "REMOVE") {
					await fullProductSheetModel.deleteOne({ id: productSheetId });
				}
				else {
					await fullProductSheetModel.updateOne(
						{ id: productSheetId },
						{ $set: { status } },
					);
				}

				throw new CreatedHttpException("productSheet.edited", productSheet);
			},
			new IHaveSentThis(CreatedHttpException.code, "productSheet.edited", productSheetSchema),
			new SwaggerIgnore(),
		);

