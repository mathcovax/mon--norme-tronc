import { categoryExistCheck } from "@checkers/category";
import { parentCategoryExistCheck } from "@checkers/parentCategory";
import { categorySchema } from "@schemas/category";
import { hasPrimordialRole } from "@security/hasPrimordialRole";

/* METHOD : POST, PATH : /parent-categories/{parentCategoryName}/categories */
export const POST = (method: Methods, path: string) => 
	hasPrimordialRole({ options: { primordialRole: "CONTENTS_MASTER" } })
		.declareRoute(method, path)
		.extract({
			params: {
				parentCategoryName: zod.string()
			},
			body: {
				categoryName: zod.string()
			}
		})
		.check(
			parentCategoryExistCheck,
			{
				input: p => p("parentCategoryName"),
				...parentCategoryExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "parentCategory.notfound")
		)
		.check(
			categoryExistCheck,
			{
				input: p => p("categoryName"),
				...categoryExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "category.notfound")
		)
		.cut(
			async ({ pickup }) => {
				const { name: parentCategoryName } = pickup("parentCategory");

				const categoriesCount = await prisma.category_to_parent_category.count({
					where: {
						parentCategoryName
					}
				});

				if (categoriesCount >= MetConfig.parentCategory.categoriesLimit) {
					throw new ConflictHttpException("parentCategory.categories.limit");
				}

				return {};
			},
			[],
			new IHaveSentThis(ConflictHttpException.code, "parentCategory.categories.limit")
		)
		.handler(
			async ({ pickup }) => {
				const { name: categoryName } = pickup("category");
				const { name: parentCategoryName } = pickup("parentCategory");

				await prisma.category_to_parent_category.create({
					data: {
						categoryName,
						parentCategoryName
					}
				});

				throw new CreatedHttpException("parentCategory.category.linked");
			},
			new IHaveSentThis(CreatedHttpException.code, "parentCategory.category.linked")
		);

/* METHOD : GET, PATH : /parent-categories/{parentCategoryName}/categories */
export const GET = (method: Methods, path: string) => 
	hasPrimordialRole({ options: { primordialRole: "CONTENTS_MASTER" } })
		.declareRoute(method, path)
		.extract({
			params: {
				parentCategoryName: zod.string()
			}
		})
		.check(
			parentCategoryExistCheck,
			{
				input: p => p("parentCategoryName"),
				...parentCategoryExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "parentCategory.notfound")
		)
		.handler(
			async ({ pickup }) => {
				const { name: parentCategoryName } = pickup("parentCategory");
		
				const categories = await prisma.category_to_parent_category.findMany({
					where: {
						parentCategoryName
					},
					select: {
						category: true
					},
					take: 10
				}).then(
					categoryToParentCategoryCollection => 
						categoryToParentCategoryCollection.map(({ category }) => category)
				);
		
				throw new OkHttpException("parentCategory.categories", categories);
			},
			new IHaveSentThis(OkHttpException.code, "parentCategory.categories", categorySchema.array())
		);
		
