import { categoryExistCheck } from "@checkers/category";
import { categorySchema } from "@schemas/category";
import { hasPrimordialRole } from "@security/hasPrimordialRole";

/* METHOD : PATCH, PATH : /categories/{categoryName} */
export const PATCH = (method: Methods, path: string) => hasPrimordialRole({ options: { primordialRole: "CONTENTS_MASTER" } })
	.declareRoute(method, path)
	.extract({
		params: {
			categoryName: zod.string()
		},
		body: zod.object({
			name: zod.string().min(3).max(255).optional(),
			disabled: zod.boolean().optional()
		}).strip()
	})
	.check(
		categoryExistCheck,
		{
			input: p => p("categoryName"),
			...categoryExistCheck.preCompletions.mustExist
		},
		new IHaveSentThis(NotFoundHttpException.code, "category.notfound")
	)
	.check(
		categoryExistCheck,
		{
			input: p => p("body").name || "",
			result: "category.notfound",
			catch: () => {
				throw new ConflictHttpException("category.alreadyExist");
			},
			skip: p => !p("body").name || p("body").name === p("categoryName")
		},
		new IHaveSentThis(ConflictHttpException.code, "category.alreadyExist")
	)
	.handler(
		async ({ pickup }) => {
			const categoryName = pickup("categoryName");
			const { name, disabled } = pickup("body");
			
			const category = await prisma.category.update({
				where: {
					name: categoryName,
				},
				data: {
					name,
					disabled
				}
			});

			throw new OkHttpException("category.edited", category);
		},
		new IHaveSentThis(OkHttpException.code, "category.edited", categorySchema)
	);
