import { parentCategoryExistCheck } from "@checkers/parentCategory";
import { hasPrimordialRole } from "@security/hasPrimordialRole";

/* METHOD : PATCH, PATH : /parent-categories/{parentCategoryName} */
export const PATCH = (method: Methods, path: string) => 
	hasPrimordialRole({ options: { primordialRole: "CONTENTS_MASTER" } })
		.declareRoute(method, path)
		.extract({
			params: {
				parentCategoryName: zod.string()
			},
			body: zod.object({
				name: zod.string().max(255).min(3).optional(),
			}).strip().default({})
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
			parentCategoryExistCheck, 
			{
				input: p => p("body").name ?? "",
				result: "parentCategory.notfound",
				catch: () => {
					throw new ConflictHttpException("parentCategory.name.alreadyUse");
				},
				skip: p => !p("body").name || p("parentCategoryName") === p("body").name
			},
			new IHaveSentThis(ConflictHttpException.code, "parentCategory.name.alreadyUse")
		)
		.handler(
			async ({ pickup }) => {
				const { name: parentCategoryName } = pickup("parentCategory");
				const { name: newParentCategoryName } = pickup("body");

				await prisma.parent_category.update({
					where: {
						name: parentCategoryName
					},
					data: {
						name: newParentCategoryName
					}
				});

				throw new OkHttpException("parentCategory.edited");
			},
			new IHaveSentThis(OkHttpException.code, "parentCategory.edited")
		);
