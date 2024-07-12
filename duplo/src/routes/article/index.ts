import { productSheetExistCheck, inputProductSheet } from "@checkers/productSheet";
import { articleCreatedSchema } from "@schemas/article";
import { mustBeConnected } from "@security/mustBeConnected";
import { CartService } from "@services/cart";
import { ProductAvailability } from "@services/productAvailability";

/* METHOD : POST, PATH : /article */
export const POST = (method: Methods, path: string) => mustBeConnected({ pickup: ["userId"] })
	.declareRoute(method, path)
	.extract({
		body: zod.object({
			productSheetId: zod.string(),
			quantity: zod.number().min(1).default(1),
		}).strip()
	})
	.check(
		productSheetExistCheck,
		{
			input: (p) => inputProductSheet.id(p("body").productSheetId),
			...productSheetExistCheck.preCompletions.mustExist
		},
		new IHaveSentThis(NotFoundHttpException.code, "productSheet.notfound")
	)
	.cut(
		async ({ pickup }) => {
			const { productSheetId } = pickup("body");
			const userId = pickup("userId");
			const articlesInCard = await CartService.getUserArticlesInCart(userId);
			const articleInCard = articlesInCard.find(aic => aic.productSheetId === productSheetId);

			if (
				!articleInCard &&
				articlesInCard.length >= MetConfig.cart.articlesLimit
			) {
				throw new UnauthorizedHttpException("cart.article.limit");
			}

			return { articleInCard: articleInCard ?? { quantity: 0 } };
		},
		["articleInCard"],
		new IHaveSentThis(UnauthorizedHttpException.code, "cart.article.limit")
	)
	.cut(
		({ pickup }) => {
			const articleInCard = pickup("articleInCard");
			const { quantity } = pickup("body");

			if (
				quantity > MetConfig.cart.quantityLimit ||
				articleInCard.quantity + quantity > MetConfig.cart.quantityLimit
			) {
				throw new UnauthorizedHttpException("cart.quantity.limit");
			}

			return {};
		},
		[],
		new IHaveSentThis(UnauthorizedHttpException.code, "cart.quantity.limit")
	)
	.cut(
		async ({ pickup }) => {
			const { productSheetId, quantity } = pickup("body");
			const articleInCard = pickup("articleInCard");
			const userId = pickup("userId");

			const quantityAvailable = await ProductAvailability.quantity(productSheetId, userId);

			if (quantityAvailable < quantity + articleInCard.quantity) {
				throw new ConflictHttpException("product.unavailable");
			}

			return {};
		},
		[],
		new IHaveSentThis(ConflictHttpException.code, "product.unavailable")
	)
	.handler(
		async ({ pickup }) => {
			const { productSheetId, quantity } = pickup("body");
			const userId = pickup("userId");
			const createdAt = new Date();

			await prisma.article.createMany({
				data: Array.from({ length: quantity }, () => ({
					productSheetId,
					userId,
					createdAt,
				})),
			});

			throw new CreatedHttpException("article.created", {
				productSheetId, quantity, userId, createdAt 
			});
		},
		new IHaveSentThis(CreatedHttpException.code, "article.created", articleCreatedSchema)
	);
