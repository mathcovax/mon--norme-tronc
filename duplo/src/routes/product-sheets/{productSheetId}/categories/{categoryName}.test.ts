import { MockPrisma } from "@test/mocks/providers";
import { DELETE } from "./{categoryName}";
import { duploTesting } from "@test/setup";
import { productSheetData } from "@test/data/productSheet";

describe("DELETE /product-sheets/{productSheetId}/categories/{categoryName}", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("separate category to product", async () => {
		const spy = vi.fn(() => null);
		MockPrisma.set("product_sheet_to_category", "delete", spy);

		const res = await duploTesting
			.testRoute(DELETE("DELETE", ""))
			.setDefaultFloorValue({ productSheet: productSheetData })
			.setRequestProperties({
				params: {
					categoryName: "1234"
				}
			})
			.mockChecker(
				0,
				{ info: "category.exist", data: { name: "1234" } },
			)
			.launch();

		expect(res.information).toBe("productSheet.category.untied");
		expect(spy).lastCalledWith({
			where: {
				categoryName_productSheetId: {
					categoryName: "1234",
					productSheetId: ""
				}
			}
		});
	});

	it("separate category to product - category notfound", async () => {
		const res = await duploTesting
			.testRoute(DELETE("DELETE", "/category/1234/product-sheet/1234"))
			.setDefaultFloorValue({ productSheet: productSheetData })
			.setRequestProperties({
				params: {
					categoryName: "1234"
				}
			})
			.mockChecker(
				0,
				{ info: "category.notfound", data: { id: "1234" } },
			)
			.launch();

		expect(res.information).toBe("category.notfound");
	});
});
