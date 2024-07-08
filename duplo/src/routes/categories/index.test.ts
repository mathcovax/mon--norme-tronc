import { categoryData } from "@test/data/category";
import { MockPrisma } from "@test/mocks/providers";
import { duploTesting } from "@test/setup";
import { GET } from ".";

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
