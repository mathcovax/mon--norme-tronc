import { ProductAvailability } from "./productAvailability";

export class CartService {
	private articlesInCart?: Awaited<ReturnType<typeof CartService["getUserArticlesInCart"]>>;
	
	getArticlesInCart(force = false) {
		if (force || !this.articlesInCart) {
			return CartService
				.getUserArticlesInCart(this.userId)
				.then(articlesInCart => this.articlesInCart = articlesInCart);
		}
		else {
			return Promise.resolve(this.articlesInCart);
		}
	}

	articlesAvailableInCart(force = false) {
		return this.getArticlesInCart(force)
			.then(
				articlesInCart => CartService.userArticlesAvailableInCart(
					this.userId,
					articlesInCart
				)
			);
	}

	constructor(
		private userId: string
	) {}

	static getUserArticlesInCart(userId: string) {
		return prisma.article.groupBy({
			by: ["productSheetId"],
			where: {
				userId,
			},
			_count: {
				productSheetId: true
			}
		}).then(
			articlesInCart => Promise.all(
				articlesInCart.map(
					aic => prisma.product_sheet.findUniqueOrThrow({
						where: { id: aic.productSheetId },
						select: { 
							price: true,
							promotions: {
								where: {
									startDate: {
										lte: new Date(),
									},
									endDate: {
										gte: new Date(),
									},
								},
								orderBy: {
									startDate: "desc"
								},
								take: 1
							}
						},
					}).then(
						ps => {
							const promotion = ps.promotions[0];

							return { 
								productSheetId: aic.productSheetId,
								quantity: aic._count.productSheetId, 
								promotion: promotion 
									? {
										id: promotion.id,
										originalPrice: ps.price,
										percentage: promotion.percentage,
										startDate: promotion.startDate,
										endDate: promotion.endDate,
									}
									: undefined,
								price: promotion 
									? Number((ps.price - (ps.price * promotion.percentage / 100)).toFixed(2))
									: ps.price
							};
						}
					)
				)
			)
		); 
	}

	static userArticlesAvailableInCart(
		userId: string, 
		articlesInCart?: CartService["articlesInCart"]
	) {
		return (
			articlesInCart
				? Promise.resolve(articlesInCart)
				: this.getUserArticlesInCart(userId)
		).then(
			articlesInCart => Promise.all(
				articlesInCart.map(
					({ productSheetId, quantity: quantityRequested }) => 
						ProductAvailability
							.quantity(productSheetId, userId)
							.then(quantityAvailable => {
								if (quantityRequested <= quantityAvailable) {
									return true;
								} else {
									return false;
								}
							})
				))
		).then(
			res => res.every(v => v)
		);
	}
}
