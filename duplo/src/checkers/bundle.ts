export const bundleExistCheck = duplo
	.createChecker("bundleExist")
	.handler(async (id: number, output) => {

		const bundle = await prisma.bundle.findFirst({
			where: {
				id
			},
		});

		if (bundle) {
			return output("bundle.exist", bundle);
		}
		else {
			return output("bundle.notfound", null);
		}
	})
	.preCompletion(
		"mustExist",
		{
			result: "bundle.exist",
			catch: () => {
				throw new NotFoundHttpException("bundle.notfound");
			},
			indexing: "bundle",
		}
	)
	.build();
