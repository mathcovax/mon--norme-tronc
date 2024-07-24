import { MockPrisma } from "@test/mocks/providers";
import { duploTesting } from "@test/setup";
import { DELETE } from "./{categoryName}";
import { parentCategoryData } from "@test/data/parentCategory";

describe("DELETE /parent-categories/{parentCategoryName}/categories/{categoryName}", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("parent category notfound", async () => {
		const res = await duploTesting
			.testRoute(DELETE("PATCH", ""))
			.setRequestProperties({
				params: {
					parentCategoryName: "rrrr",
					categoryName: "TOTO",
				},
			})
			.mockChecker(0, { info: "parentCategory.notfound", data: null })
			.launch();

		expect(res.information).toBe("parentCategory.notfound");
	});

	it("delete parent category", async () => {
		const spy = vi.fn(async () => ({}));
		MockPrisma.set("category_to_parent_category", "delete", spy);

		const res = await duploTesting
			.testRoute(DELETE("PATCH", ""))
			.setRequestProperties({
				params: {
					parentCategoryName: "rrrr",
					categoryName: "TOTO",
				},
			})
			.mockChecker(0, { info: "parentCategory.exist", data: parentCategoryData })
			.launch();

		expect(res.information).toBe("parentCategory.category.untied");
		expect(spy).lastCalledWith({
			where: {
				categoryName_parentCategoryName: {
					categoryName: "TOTO",
					parentCategoryName: "tulutu"
				}
			}
		});
	});
});
