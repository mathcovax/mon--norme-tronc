import { MockPrisma } from "@test/mocks/providers";
import { GET, POST } from ".";
import { duploTesting } from "@test/setup";
import { productSheetData } from "@test/data/productSheet";
import { categoryData } from "@test/data/category";

describe("POST /product-sheets/{productSheetId}/categories", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("attribute category to product sheet", async () => {
		const spy = vi.fn(() => null);
		const spy2 = vi.fn(() => 0);
		MockPrisma.set("product_sheet_to_category", "create", spy);
		MockPrisma.set("product_sheet_to_category", "count", spy2);

		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setDefaultFloorValue({ productSheet: productSheetData })
			.setRequestProperties({
				body: {
					categoryName: "1234"
				}
			})
			.mockChecker(
				0,
				{ info: "category.exist", data: { id: "1234" } },
			)
			.launch();

		expect(res.information).toBe("productSheet.category.linked");
		expect(spy2).lastCalledWith({
			where: {
				productSheetId: ""
			}
		});
		expect(spy).lastCalledWith({
			data: {
				productSheetId: "",
				categoryName: "1234"
			}
		});
	});

	it("product sheet count > 4", async () => {
		const spy = vi.fn(() => 5);
		MockPrisma.set("product_sheet_to_category", "count", spy);

		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setDefaultFloorValue({ productSheet: productSheetData })
			.setRequestProperties({
				body: {
					categoryName: "1234"
				}
			})
			.mockChecker(
				0,
				{ info: "category.exist", data: { id: "1234" } },
			)
			.launch();

		expect(res.information).toBe("productSheet.categories.limit");
		expect(spy).lastCalledWith({
			where: {
				productSheetId: ""
			}
		});
	});

	it("category notfound", async () => {

		const res = await duploTesting
			.testRoute(POST("POST", "/catgory/test/product-sheet"))
			.setDefaultFloorValue({ productSheet: productSheetData })
			.setRequestProperties({
				body: {
					categoryName: "1234"
				}
			})
			.mockChecker(
				"categoryExist",
				{ info: "category.notfound", data: { id: "1234" } },
			)
			.launch();

		expect(res.information).toBe("category.notfound");
	});
});

describe("GET /product-sheet/{productSheetId}/categories", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("get categories where product", async () => {
		const spy = vi.fn(async() => [{ category: categoryData }]);
		MockPrisma.set("product_sheet_to_category", "findMany", spy);

		const res = await duploTesting
			.testRoute(GET("GET", "/product-sheet/1234/categories"))
			.setDefaultFloorValue({ productSheet: productSheetData })
			.launch();

		expect(res.information).toBe("productSheet.categories");
		expect(spy).lastCalledWith({
			where: {
				productSheetId: ""
			},
			select: {
				category: true
			},
			take: 5
		});
	});
});
