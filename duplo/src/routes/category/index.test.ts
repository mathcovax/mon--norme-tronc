import { MockPrisma } from "@test/mocks/providers";
import { duploTesting } from "@test/setup";
import { POST } from ".";
import { categoryData } from "@test/data/category";

describe("POST /category", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("post category with used name", async () => {
		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setRequestProperties({
				body: {
					name: "test",
					disabled: true,
				}
			})
			.mockChecker(
				0,
				{
					info: "category.exist",
					data: undefined
				}
			)
			.launch();
			
		expect(res.information).toBe("category.alreadyExist");
	});

	it("post category without used name", async () => {
		const spy = vi.fn(() => categoryData);
		MockPrisma.set("category", "create", spy);

		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setRequestProperties({
				body: {
					name: "test",
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
			
		expect(res.information).toBe("category.created");
		expect(spy).lastCalledWith({
			data: {
				disabled: true,
				name: "test"
			}
		});
	});
});
