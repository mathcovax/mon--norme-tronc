import { hasPrimordialRole } from "@security/hasPrimordialRole";
import { navigationItemCategorySchema, navigationItemLinkSchema, navigationItemParentCategorySchema, navigationItemSchema } from "@schemas/navigationItem";


/* METHOD : GET, PATH : /navigation-items */
export const GET = (method: Methods, path: string) => 
	hasPrimordialRole({ options: { primordialRole: "CONTENTS_MASTER" } })
		.declareRoute(method, path)
		.handler(
			async () => {
				const navigationItems = await prisma.navigation_item.findMany({ take: 10, orderBy: { priority: "asc" } });

				throw new OkHttpException("navigationItems", navigationItems);
			},
			new IHaveSentThis(OkHttpException.code, "navigationItems", navigationItemSchema.array())
		);

/* METHOD : POST, PATH : /navigation-items */
export const POST = (method: Methods, path: string) => 
	hasPrimordialRole({ options: { primordialRole: "CONTENTS_MASTER" } })
		.declareRoute(method, path)
		.extract({
			body: zod.union([
				navigationItemParentCategorySchema.omit({ id: true }),
				navigationItemCategorySchema.omit({ id: true }),
				navigationItemLinkSchema.omit({ id: true }),
			])
		})
		.cut(
			async () => {
				const navigationItemCount = await prisma.navigation_item.count();

				if (navigationItemCount >= MetConfig.navigationBar.itemsLimit) {
					throw new ConflictHttpException("navigationItem.limit");
				}

				return {};
			},
			[],
			new IHaveSentThis(ConflictHttpException.code, "navigationItem.limit")
		)
		.handler(
			async ({ pickup }) => {
				const newNavigationItem = pickup("body");

				const navigationItem = await prisma.navigation_item.create({ data: newNavigationItem });

				throw new CreatedHttpException("navigationItem.created", navigationItem);
			},
			new IHaveSentThis(CreatedHttpException.code, "navigationItem.created", navigationItemSchema)
		);
