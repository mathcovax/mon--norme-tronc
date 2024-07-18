import { newsletterSchema } from "@schemas/newsletter";
import { hasPrimordialRole } from "@security/hasPrimordialRole";

/* METHOD : GET, PATH : /newsletters */
export const GET = (method: Methods, path: string) =>
	hasPrimordialRole({ options: { primordialRole: "CONTENTS_MASTER" } })
		.declareRoute(method, path)
		.extract({
			query: {
				page: zod.coerce.number().default(0),
				object: zod.string().optional(),
			}
		})
		.handler(
			async ({ pickup }) => {
				const page = pickup("page");
				const object = pickup("object");

				const newsletters = await prisma.newsletter.findMany({
					where: {
						object: object
							? {
								contains: object,
								mode: "insensitive"
							}
							: undefined,
					},
					skip: 10 * page,
					take: 10
				});

				throw new OkHttpException("newsletters", newsletters);
			},
			new IHaveSentThis(OkHttpException.code, "newsletters", newsletterSchema.array())
		);
