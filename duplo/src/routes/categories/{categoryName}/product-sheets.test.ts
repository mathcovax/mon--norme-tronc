import { MockPrisma } from "@test/mocks/providers";
import { GET } from "./product-sheets";
import { duploTesting } from "@test/setup";
import { productSheetData } from "@test/data/productSheet";

describe("GET /categories/{categoryName}/product-sheets", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("category products", async () => {
		const productSheetToCategory = [{ productSheet: productSheetData }];
		const spy = vi.fn(async () => productSheetToCategory);
		MockPrisma.set("product_sheet_to_category", "findMany", spy);

		const res = await duploTesting
			.testRoute(GET("GET", "/category/test/product-sheets"))
			.setRequestProperties({ params: { categoryName: "test" } })
			.mockChecker(
				"categoryExist",
				{ info: "category.exist", data: { name: "test" } },
			)
			.launch();
			
		expect(spy).lastCalledWith({
			where: { category: { name: "test" } },
			select: { productSheet: true },
			skip: 0,
			take: 10
		});
		expect(res.information).toBe("category.products");
	});

	it("category notfound", async () => {
		const res = await duploTesting
			.testRoute(GET("GET", "/category/test/product-sheets"))
			.setRequestProperties({ params: { categoryName: "test" } })
			.mockChecker(
				"categoryExist",
				{ info: "category.notfound", data: { name: "test" } },
			)
			.launch();

		expect(res.information).toBe("category.notfound");
	});
});
