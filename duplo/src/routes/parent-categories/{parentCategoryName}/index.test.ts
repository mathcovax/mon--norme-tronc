import { MockPrisma } from "@test/mocks/providers";
import { duploTesting } from "@test/setup";
import { PATCH } from ".";
import { parentCategoryData } from "@test/data/parentCategory";

describe("PATCH /parent-categories/{parentCategoryName}", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("parent category notfound", async () => {
		const res = await duploTesting
			.testRoute(PATCH("PATCH", ""))
			.setRequestProperties({
				params: {
					parentCategoryName: "rrrr"
				},
				body: parentCategoryData
			})
			.mockChecker(0, { info: "parentCategory.notfound", data: null })
			.launch();

		expect(res.information).toBe("parentCategory.notfound");
	});

	it("parent category name already use", async () => {
		const res = await duploTesting
			.testRoute(PATCH("PATCH", ""))
			.setRequestProperties({
				params: {
					parentCategoryName: "rrrr"
				},
				body: parentCategoryData
			})
			.mockChecker(0, { info: "parentCategory.exist", data: parentCategoryData })
			.mockChecker(1, { info: "parentCategory.exist", data: parentCategoryData })
			.launch();

		expect(res.information).toBe("parentCategory.name.alreadyUse");
	});

	it("parent category notfound", async () => {
		const spy = vi.fn(async () => ({}));
		MockPrisma.set("parent_category", "update", spy);

		const res = await duploTesting
			.testRoute(PATCH("PATCH", ""))
			.setRequestProperties({
				params: {
					parentCategoryName: "rrrr"
				},
				body: parentCategoryData
			})
			.mockChecker(0, { info: "parentCategory.exist", data: parentCategoryData })
			.mockChecker(1, { info: "parentCategory.notfound", data: null })
			.launch();

		expect(res.information).toBe("parentCategory.edited");
		expect(spy).lastCalledWith({
			data: {
				name: "tulutu"
			},
			where: {
				name: "tulutu"
			}
		});
	});
});
