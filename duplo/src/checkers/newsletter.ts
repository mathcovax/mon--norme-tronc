export const newsletterExistCheck = duplo
	.createChecker("newsletterExist")
	.handler(async (id: string, output) => {
		const newsletter = await prisma.newsletter.findFirst({
			where: {
				id
			},
		});

		if (newsletter) {
			return output("newsletter.exist", newsletter);
		}
		else {
			return output("newsletter.notfound", null);
		}
	})
	.preCompletion(
		"mustExist",
		{
			result: "newsletter.exist",
			catch: () => {
				throw new NotFoundHttpException("newsletter.notfound");
			},
			indexing: "newsletter",
		}
	)
	.build();
