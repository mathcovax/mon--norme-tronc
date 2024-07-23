import { categorySchema } from "@schemas/category";
import { categoryExistCheck } from "@checkers/category";
import { hasPrimordialRole } from "@security/hasPrimordialRole";

/* METHOD : GET, PATH : /categories */
export const GET = (method: Methods, path: string) => duplo
	.declareRoute(method, path)
	.extract({
		query: zod.object({
			name: zod.string().optional(),
			page: zod.coerce.number().default(0),
			take: zod.coerce.number().min(1).max(12).default(12),
			withDisabled: zod.coerce.boolean().optional()
		}).strip().default({})
	})
	.handler(
		async ({ pickup }) => {
			const { name, withDisabled, page, take } = pickup("query");

			const categories = await prisma.category.findMany({
				where: {
					name: name
						? {
							contains: name,
							mode: "insensitive"
						}
						: undefined,
					disabled: withDisabled 
						? undefined
						: false
				},
				skip: page * take,
				take: take,
			});

			throw new OkHttpException("categories", categories);
		},
		new IHaveSentThis(OkHttpException.code, "categories", categorySchema.array())
	);

/* METHOD : POST, PATH : /categories */
export const POST = (method: Methods, path: string) => hasPrimordialRole({ options: { primordialRole: "CONTENTS_MASTER" } })
	.declareRoute(method, path)
	.extract({
		body: zod.object({
			name: zod.string().min(3).max(255),
			disabled: zod.boolean()
		}).strip()
	})
	.check(
		categoryExistCheck,
		{
			input: p => p("body").name,
			result: "category.notfound",
			catch: () => {
				throw new ConflictHttpException("category.alreadyExist");
			}
		},
		new IHaveSentThis(ConflictHttpException.code, "category.alreadyExist")
	)
	.handler(
		async ({ pickup }) => {
			const { name, disabled } = pickup("body");
			
			const category = await prisma.category.create({
				data: {
					name,
					disabled
				}
			});

			throw new CreatedHttpException("category.created", category);
		},
		new IHaveSentThis(CreatedHttpException.code, "category.created", categorySchema)
	);
