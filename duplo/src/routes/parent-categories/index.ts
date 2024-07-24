import { parentCategoryExistCheck } from "@checkers/parentCategory";
import { parentCategorySchema, parentCategoryWithCategoriesNameSchema } from "@schemas/parentCategory";
import { hasPrimordialRole } from "@security/hasPrimordialRole";
import { stringBoolean } from "@utils/zod";

/* METHOD : GET, PATH : /parent-categories */
export const GET = (method: Methods, path: string) => 
	hasPrimordialRole({ options: { primordialRole: "CONTENTS_MASTER" } })
		.declareRoute(method, path)
		.extract({
			query: {
				page: zod.coerce.number().default(0),
				name: zod.string().optional(),
				withCategories: stringBoolean.optional(),
			}
		})
		.handler(
			async ({ pickup }) => {
				const page = pickup("page");
				const name = pickup("name");
				const withCategories = pickup("withCategories");

				const parentCategories = await prisma.parent_category.findMany({
					where: {
						name: name 
							? {
								contains: name,
								mode: "insensitive"
							}	
							: undefined,
					},
					select: withCategories 
						? { 
							name: true,
							categories: {
								select: {
									categoryName: true
								}
							} 
						}
						: undefined,
					skip: 10 * page,
					take: 10
				});
				
				throw new OkHttpException("parentCategories", parentCategories);
			},
			new IHaveSentThis(OkHttpException.code, "parentCategories", parentCategoryWithCategoriesNameSchema.array())
		);

/* METHOD : POST, PATH : /parent-categories */
export const POST = (method: Methods, path: string) => 
	hasPrimordialRole({ options: { primordialRole: "CONTENTS_MASTER" } })
		.declareRoute(method, path)
		.extract({
			body: zod.object({
				name: zod.string().max(255).min(3),
			}).strip()
		})
		.check(
			parentCategoryExistCheck, 
			{
				input: p => p("body").name,
				result: "parentCategory.notfound",
				catch: () => {
					throw new ConflictHttpException("parentCategory.name.alreadyUse");
				},
			},
			new IHaveSentThis(ConflictHttpException.code, "parentCategory.name.alreadyUse")
		)
		.handler(
			async ({ pickup }) => {
				const { name: parentCategoryName } = pickup("body");

				const parentCategory = await prisma.parent_category.create({
					data: {
						name: parentCategoryName
					}
				});

				throw new CreatedHttpException("parentCategory.created", parentCategory);
			},
			new IHaveSentThis(CreatedHttpException.code, "parentCategory.created", parentCategorySchema)
		);
