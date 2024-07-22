import { mustBeConnected } from "@security/mustBeConnected";
import { productSheetExistCheck, inputProductSheet } from "@checkers/productSheet";

/* METHOD : DELETE, PATH : /article/{productSheetId} */
export const DELETE = (method: Methods, path: string) => 
	mustBeConnected({ pickup: ["user"] })
		.declareRoute(method, path)
		.extract({
			params: zod.object({
				productSheetId: zod.string(),
			}).strip()
		})
		.check(
			productSheetExistCheck,
			{
				input: (p) => inputProductSheet.id(p("params").productSheetId),
				...productSheetExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "productSheet.notfound")
		)
		.handler(
			async ({ pickup }) => {
				const { id: productSheetId } = pickup("productSheet");
				const { id: userId } = pickup("user");

				await prisma.$queryRaw`
			DELETE FROM article
			WHERE id IN (
				SELECT id
				FROM article AS a
				WHERE 
					a."productSheetId" = ${productSheetId}
				AND "userId" = ${userId}
				LIMIT 1
			)
			`;

				throw new OkHttpException("article.deleted");
			},
			new IHaveSentThis(OkHttpException.code, "article.deleted")
		);
