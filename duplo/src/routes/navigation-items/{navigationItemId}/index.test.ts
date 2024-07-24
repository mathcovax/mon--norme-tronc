import { duploTesting } from "@test/setup";
import { DELETE, PATCH } from ".";
import { navigationItemCategoryData, navigationItemData } from "@test/data/navigationItem";
import { categoryData } from "@test/data/category";
import { parentCategoryData } from "@test/data/parentCategory";
import { MockPrisma } from "@test/mocks/providers";

describe("/navigation-items/{navigationItemId}", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	describe("PATCH", () => {
		it("navigation item notfound", async () => {
			const res = await duploTesting
				.testRoute(PATCH("PATCH", ""))
				.setRequestProperties({
					params: {
						navigationItemId: "eeee",
					},
					body: navigationItemData,
				})
				.mockChecker(0, { info: "navigationItem.notfound", data: null })
				.launch();

			expect(res.information).toBe("navigationItem.notfound");
		});

		it("category notfound", async () => {
			const res = await duploTesting
				.testRoute(PATCH("PATCH", ""))
				.setRequestProperties({
					params: {
						navigationItemId: "eeee",
					},
					body: navigationItemCategoryData,
				})
				.mockChecker(0, { info: "navigationItem.exist", data: navigationItemCategoryData })
				.mockChecker(1, { info: "category.notfound", data: null })
				.launch();

			expect(res.information).toBe("category.notfound");
		});

		it("parentCategory notfound", async () => {
			const res = await duploTesting
				.testRoute(PATCH("PATCH", ""))
				.setRequestProperties({
					params: {
						navigationItemId: "eeee",
					},
					body: navigationItemData,
				})
				.mockChecker(0, { info: "navigationItem.exist", data: navigationItemData })
				.mockChecker(1, { info: "category.exist", data: categoryData })
				.mockChecker(2, { info: "parentCategory.notfound", data: null })
				.launch();

			expect(res.information).toBe("parentCategory.notfound");
		});

		it("post navigation item", async () => {
			const spy = vi.fn(async () => navigationItemData);
			MockPrisma.set("navigation_item", "update", spy);

			const res = await duploTesting
				.testRoute(PATCH("PATCH", ""))
				.setRequestProperties({
					params: {
						navigationItemId: "eeee",
					},
					body: navigationItemData,
				})
				.mockChecker(0, { info: "navigationItem.exist", data: navigationItemData })
				.mockChecker(1, { info: "category.exist", data: categoryData })
				.mockChecker(2, { info: "parentCategory.exist", data: parentCategoryData })
				.launch();

			expect(res.information).toBe("navigationItem.edited");
			expect(spy).lastCalledWith({
				data: {
					categoryName: null,
					id: "toto",
					parentCategoryName: "test",
					priority: 10,
					title: null,
					type: "PARENT_CATEGORY",
					url: null,
				},
				where: {
					id: "toto"
				}
			});
		});
	});

	describe("DELETE", () => {
		it("navigation item notfound", async () => {
			const res = await duploTesting
				.testRoute(DELETE("DELETE", ""))
				.setRequestProperties({
					params: {
						navigationItemId: "eeee",
					},
				})
				.mockChecker(0, { info: "navigationItem.notfound", data: null })
				.launch();

			expect(res.information).toBe("navigationItem.notfound");
		});

		it("delete navigation item", async () => {
			const spy = vi.fn(async () => ({}));
			MockPrisma.set("navigation_item", "delete", spy);

			const res = await duploTesting
				.testRoute(DELETE("DELETE", ""))
				.setRequestProperties({
					params: {
						navigationItemId: "eeee",
					},
				})
				.mockChecker(0, { info: "navigationItem.exist", data: navigationItemData })
				.launch();

			expect(res.information).toBe("navigationItem.delete");
			expect(spy).lastCalledWith({
				where: {
					id: "toto"
				}
			});
		});
	});
});
