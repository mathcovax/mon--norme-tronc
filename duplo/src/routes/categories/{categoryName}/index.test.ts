import { MockPrisma } from "@test/mocks/providers";
import { duploTesting } from "@test/setup";
import { PATCH } from ".";
import { categoryData } from "@test/data/category";

describe("PATCH /categories/{categoryName}", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("patch category not exist", async () => {
		const res = await duploTesting
			.testRoute(PATCH("PATCH", ""))
			.setRequestProperties({
				params: {
					categoryName: "test"
				},
				body: {
					disabled: true,
				}
			})
			.mockChecker(
				0,
				{
					info: "category.notfound",
					data: null
				}
			)
			.launch();
			
		expect(res.information).toBe("category.notfound");
	});

	it("patch category with used name", async () => {
		const res = await duploTesting
			.testRoute(PATCH("PATCH", ""))
			.setRequestProperties({
				params: {
					categoryName: "testt"
				},
				body: {
					name: "eee",
					disabled: true,
				}
			})
			.mockChecker(
				0,
				{
					info: "category.exist",
					data: null
				}
			)
			.mockChecker(
				1,
				{
					info: "category.exist",
					data: undefined
				}
			)
			.launch();
			
		expect(res.information).toBe("category.alreadyExist");
	});

	it("patch category with same name", async () => {
		const spy = vi.fn(() => categoryData);
		MockPrisma.set("category", "update", spy);

		const res = await duploTesting
			.testRoute(PATCH("PATCH", ""))
			.setRequestProperties({
				params: {
					categoryName: "testt"
				},
				body: {
					name: "testt",
					disabled: true,
				}
			})
			.mockChecker(
				0,
				{
					info: "category.exist",
					data: null
				}
			)
			.mockChecker(
				1,
				{
					info: "category.exist",
					data: undefined
				}
			)
			.launch();
			
		expect(res.information).toBe("category.edited");
		expect(spy).lastCalledWith({
			data: {
				disabled: true,
				name: "testt"
			},
			where: {
				name: "testt"
			}
		});
	});
});
