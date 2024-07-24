import { categoryData } from "@test/data/category";
import { MockPrisma } from "@test/mocks/providers";
import { duploTesting } from "@test/setup";
import { GET } from ".";
import { POST } from ".";

describe("GET /categories", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("get categories with query", async () => {
		const spy = vi.fn(() => [categoryData]);
		MockPrisma.set("category", "findMany", spy);

		const res = await duploTesting
			.testRoute(GET("GET", ""))
			.setRequestProperties({
				query: {
					name: "test",
					page: 2,
					withDisabled: true,
				}
			})
			.launch();
			
		expect(res.information).toBe("categories");
		expect(spy).lastCalledWith({
			skip: 24,
			take: 12,
			where: {
				disabled: undefined,
				name: {
					contains: "test",
					mode: "insensitive",
				}
			}
		});
	});
	it("get categories without query", async () => {
		const spy = vi.fn(() => [categoryData]);
		MockPrisma.set("category", "findMany", spy);

		const res = await duploTesting
			.testRoute(GET("GET", ""))
			.launch();
			
		expect(res.information).toBe("categories");
		expect(spy).lastCalledWith({
			skip: 0,
			take: 12,
			where: {
				disabled: false,
				name: undefined
			}
		});
	});
});

describe("POST /categories", () => {
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

	it("post category with used name", async () => {
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

