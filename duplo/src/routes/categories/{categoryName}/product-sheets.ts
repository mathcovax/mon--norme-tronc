import { categoryExistCheck } from "@checkers/category";
import { productSheetSchema } from "@schemas/productSheet";

/* METHOD : GET, PATH : /categories/{categoryName}/product-sheets */
export const GET = (method: Methods, path: string) =>
	duplo
		.declareRoute(method, path)
		.extract({
			params: {
				categoryName: zod.string(),
			},
			query: {
				page: zod.coerce.number().default(0)
			}
		})
		.check(
			categoryExistCheck,
			{
				input: (p) => p("categoryName"),
				...categoryExistCheck.preCompletions.mustExist

			},
			new IHaveSentThis(NotFoundHttpException.code, "category.notfound")
		)
		.handler(
			async ({ pickup }) => {
				const page = pickup("page");
				const { name: categoryName } = pickup("category");

				const productsSheets = await prisma.product_sheet_to_category
					.findMany({
						where: {
							category: {
								name: categoryName,
							},
						},
						select: {
							productSheet: true,
						},
						skip: page * 10,
						take: 10
					})
					.then((productsSheets) => productsSheets.map((p) => p.productSheet));

				throw new OkHttpException("category.products", productsSheets);
			},
			new IHaveSentThis(OkHttpException.code, "category.products", productSheetSchema.array())
		);
