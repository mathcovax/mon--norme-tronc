export const productReturnExistCheck = duplo
	.createChecker("productReturnExist")
	.handler(async (id: number, output) => {

		const productReturn = await prisma.product_return.findFirst({
			where: {
				id
			},
		});

		if (productReturn) {
			return output("productReturn.exist", productReturn);
		}
		else {
			return output("productReturn.notfound", null);
		}
	})
	.preCompletion(
		"mustExist",
		{
			result: "productReturn.exist",
			catch: () => {
				throw new NotFoundHttpException("productReturn.notfound");
			},
			indexing: "productReturn",
		}
	)
	.build();
