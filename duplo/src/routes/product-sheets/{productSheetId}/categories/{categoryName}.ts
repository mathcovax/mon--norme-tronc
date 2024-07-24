import { categoryExistCheck } from "@checkers/category";
import { hasOrganizationRoleByProductSheetId } from "@security/hasOrganizationRole/byProductSheetId";

/* METHOD : DELETE, PATH : /product-sheets/{productSheetId}/categories/{categoryName} */
export const DELETE = (method: Methods, path: string) =>
	hasOrganizationRoleByProductSheetId({ pickup: ["productSheet"] })
		.declareRoute(method, path)
		.extract({
			params: {
				categoryName: zod.string(),
			},
		})
		.check(
			categoryExistCheck,
			{
				input: (p) => p("categoryName"),
				result: "category.exist",
				catch: () => {
					throw new NotFoundHttpException("category.notfound");
				},
				indexing: "category"
			},
			new IHaveSentThis(NotFoundHttpException.code, "category.notfound")
		)
		.handler(
			async ({ pickup }) => {
				const { id: productSheetId } = pickup("productSheet");
				const categoryName = pickup("categoryName");

				await prisma.product_sheet_to_category.delete({
					where: {
						categoryName_productSheetId: {
							productSheetId,
							categoryName,
						}
					},
				});

				throw new OkHttpException("productSheet.category.untied");
			}, 
			new IHaveSentThis(OkHttpException.code, "productSheet.category.untied")
		);
