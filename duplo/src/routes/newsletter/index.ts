import { newsletterSchema } from "@schemas/newsletter";
import { hasPrimordialRole } from "@security/hasPrimordialRole";

/* METHOD : POST, PATH : /newsletter */
export const POST = (method: Methods, path: string) =>
	hasPrimordialRole({ options: { primordialRole: "CONTENTS_MASTER" } })
		.declareRoute(method, path)
		.extract({
			body: zod.object({
				title: zod.string().max(255).min(3),
				content: zod.string(),
			}).strip()
		})
		.handler(
			async ({ pickup }) => {
				const { title, content } = pickup("body");

				const newsletter = await prisma.newsletter.create({
					data: {
						title,
						content,
					}
				});

				throw new CreatedHttpException("newsletter.created", newsletter);
			},
			new IHaveSentThis(CreatedHttpException.code, "newsletter.created", newsletterSchema)
		);
