
/* METHOD : GET, PATH : /categories-count */
export const GET = (method: Methods, path: string) =>
	duplo
		.declareRoute(method, path)
		.handler(
			async () => {
				const categoriesCount = await prisma.category.count();

				throw new OkHttpException("categoriesCount", categoriesCount);
			},
			new IHaveSentThis(OkHttpException.code, "categoriesCount", zod.number())
		);
