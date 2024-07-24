import { categoryExistCheck } from "@checkers/category";
import { navigationItemExistCheck } from "@checkers/navigationItem";
import { parentCategoryExistCheck } from "@checkers/parentCategory";
import { navigationItemSchema } from "@schemas/navigationItem";
import { hasPrimordialRole } from "@security/hasPrimordialRole";

/* METHOD : PATCH, PATH : /navigation-items/{navigationItemId} */
export const PATCH = (method: Methods, path: string) => 
	hasPrimordialRole({ options: { primordialRole: "CONTENTS_MASTER" } })
		.declareRoute(method, path)
		.extract({
			params: {
				navigationItemId: zod.string()
			},
			body: navigationItemSchema
		})
		.check(
			navigationItemExistCheck,
			{
				input: p => p("navigationItemId"),
				...navigationItemExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "navigationItem.notfound")
		)
		.check(
			categoryExistCheck,
			{
				input: p => {
					const navigationItem = p("body");
					return navigationItem.type === "CATEGORY" ? navigationItem.categoryName : "";
				},
				...categoryExistCheck.preCompletions.mustExist,
				skip: p => p("body").type !== "CATEGORY"
			},
			new IHaveSentThis(NotFoundHttpException.code, "category.notfound")
		)
		.check(
			parentCategoryExistCheck,
			{
				input: p => {
					const navigationItem = p("body");
					return navigationItem.type === "PARENT_CATEGORY" ? navigationItem.parentCategoryName : "";
				},
				...parentCategoryExistCheck.preCompletions.mustExist,
				skip: p => p("body").type !== "PARENT_CATEGORY"
			},
			new IHaveSentThis(NotFoundHttpException.code, "parentCategory.notfound")
		)
		.handler(
			async ({ pickup }) => {
				const { id: navigationItemId } = pickup("navigationItem");
				const newNavigationItem = pickup("body");

				const navigationItem = await prisma.navigation_item.update({
					where: {
						id: navigationItemId
					},
					data: {
						parentCategoryName: null,
						categoryName: null,
						url: null,
						title: null,
						...newNavigationItem
					}
				});

				throw new OkHttpException("navigationItem.edited", navigationItem);
			},
			new IHaveSentThis(OkHttpException.code, "navigationItem.edited", navigationItemSchema)
		);

/* METHOD : DELETE, PATH : /navigation-items/{navigationItemId} */
export const DELETE = (method: Methods, path: string) => 
	hasPrimordialRole({ options: { primordialRole: "CONTENTS_MASTER" } })
		.declareRoute(method, path)
		.extract({
			params: {
				navigationItemId: zod.string()
			}
		})
		.check(
			navigationItemExistCheck,
			{
				input: p => p("navigationItemId"),
				...navigationItemExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "navigationItem.notfound")
		)
		.handler(
			async ({ pickup }) => {
				const { id: navigationItemId } = pickup("navigationItem");
	
				await prisma.navigation_item.delete({
					where: {
						id: navigationItemId
					}
				});
	
				throw new NoContentHttpException("navigationItem.delete");
			},
			new IHaveSentThis(NoContentHttpException.code, "navigationItem.delete")
		);
