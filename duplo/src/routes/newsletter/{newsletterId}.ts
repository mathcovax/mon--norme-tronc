import { hasPrimordialRole } from "@security/hasPrimordialRole";

/* METHOD : DELETE, PATH : /newsletter/{newsletterId} */
export const DELETE = (method: Methods, path: string) =>
	hasPrimordialRole({ options: { primordialRole: "CONTENTS_MASTER" } })
		.declareRoute(method, path)
		.extract({
			params: {
				newsletterId: zod.string(),
			}
		})
		.handler(
			async ({ pickup }) => {
				const newsletterId = pickup("newsletterId");

				await prisma.newsletter.delete({
					where: {
						id: newsletterId,
					}
				});

				throw new NoContentHttpException("newsletter.deleted");
			},
			new IHaveSentThis(NoContentHttpException.code, "newsletter.deleted")
		);
