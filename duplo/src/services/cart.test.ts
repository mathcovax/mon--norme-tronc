import { MockPrisma } from "@test/mocks/providers";
import { CartService } from "./cart";
import { ProductAvailability } from "./productAvailability";

describe("Cart Service", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("force getArticlesInCart", async () => {
		const dateNow = new Date();
		vi.setSystemTime(dateNow);
		const fetchedArticles = [
			{
				productSheetId: "",
				quantity: 1,
				promotion: undefined,
				price: 100, 
				_count: { productSheetId: 1 }
			}
		];
		const productSheet = {
			price: 100,
			promotions: []
		};
		const userId = "userTestId";
		const articlesSpy = vi.fn(async () => fetchedArticles);
		const productSheetSpy = vi.fn(async () => productSheet);
		MockPrisma.set("article", "groupBy", articlesSpy);
		MockPrisma.set("product_sheet", "findUniqueOrThrow", productSheetSpy);
		const cartService = new CartService(userId);
		const result = await cartService.getArticlesInCart();
		expect(articlesSpy).toBeCalledWith({
			by: ["productSheetId"],
			where: {
				userId,
			},
			_count: {
				productSheetId: true
			}
		});
		expect(productSheetSpy).toBeCalledWith({
			where: { id: fetchedArticles[0].productSheetId },
			select: { 
				price: true,
				promotions: {
					where: {
						startDate: {
							lte: dateNow,
						},
						endDate: {
							gte: dateNow,
						},
					},
					orderBy: {
						startDate: "desc"
					},
					take: 1
				}
			},
		});
		expect(result).toEqual([
			{
				productSheetId: "",
				quantity: 1,
				promotion: undefined,
				price: 100,
			}
		]);
	});

	it("requestedQuantity available should return true", async () => {
		vi.spyOn(CartService, "getUserArticlesInCart").mockResolvedValue([
			{
				productSheetId: "1234",
				quantity: 1,
				promotion: undefined,
				price: 100
			}
		]);
		vi.spyOn(ProductAvailability, "quantity").mockResolvedValue(1);
		const result = await CartService.userArticlesAvailableInCart("1234");
		expect(result).toBe(true);
	});

	it("requestedQuantity not available should return false", async () => {
		vi.spyOn(CartService, "getUserArticlesInCart").mockResolvedValue([
			{
				productSheetId: "1234",
				quantity: 1,
				promotion: undefined,
				price: 100
			}
		]);
		vi.spyOn(ProductAvailability, "quantity").mockResolvedValue(0);
		const result = await CartService.userArticlesAvailableInCart("1234");
		expect(result).toBe(false);
	});
});
