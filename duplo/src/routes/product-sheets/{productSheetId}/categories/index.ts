import { categoryExistCheck } from "@checkers/category";
import { categorySchema } from "@schemas/category";
import { hasOrganizationRoleByProductSheetId } from "@security/hasOrganizationRole/byProductSheetId";

/* METHOD : POST, PATH : /product-sheets/{productSheetId}/categories */
export const POST = (method: Methods, path: string) =>
	hasOrganizationRoleByProductSheetId({ pickup: ["productSheet"] })
		.declareRoute(method, path)
		.extract({
			body: zod.object({
				categoryName: zod.string(),
			}).strip()
		})
		.check(
			categoryExistCheck,
			{
				input: (p) => p("body").categoryName,
				...categoryExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "category.notfound")
		)
		.cut(
			async ({ pickup }) => {
				const { id: productSheetId } = pickup("productSheet");
				const categoriesProductSheetCount = await prisma.product_sheet_to_category.count({
					where: {
						productSheetId,
					}
				});

				if (categoriesProductSheetCount >= MetConfig.productSheet.categoriesLimit) {
					throw new ConflictHttpException("productSheet.categories.limit");
				}

				return {};
			},
			[],
			new IHaveSentThis(ConflictHttpException.code, "productSheet.categories.limit")
		)
		.handler(
			async ({ pickup }) => {
				const { id: productSheetId } = pickup("productSheet");
				const { categoryName } = pickup("body");

				await prisma.product_sheet_to_category.create({
					data: {
						categoryName,
						productSheetId
					},
				});

				throw new CreatedHttpException("productSheet.category.linked");
			}, 
			new IHaveSentThis(CreatedHttpException.code, "productSheet.category.linked")
		);

/* METHOD : GET, PATH : /product-sheets/{productSheetId}/categories */
export const GET = (method: Methods, path: string) =>
	hasOrganizationRoleByProductSheetId({ pickup: ["productSheet"] })
		.declareRoute(method, path)
		.handler(
			async ({ pickup }) => {
				const { id: productSheetId } = pickup("productSheet");

				const categories = await prisma.product_sheet_to_category.findMany({
					where: {
						productSheetId,
					},
					select: {
						category: true
					},
					take: 5,
				}).then((pstc) => pstc.map(({ category }) => category));

				throw new OkHttpException("productSheet.categories", categories);
			},
			new IHaveSentThis(OkHttpException.code, "productSheet.categories", categorySchema.array())
		);
