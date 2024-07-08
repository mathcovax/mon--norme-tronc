import { categoryData } from "@test/data/category";
import { MockPrisma } from "@test/mocks/providers";
import { duploTesting } from "@test/setup";
import { GET } from ".";

describe("GET /categories-count", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("get categories count", async () => {
		const spy = vi.fn(() => [categoryData].length);
		MockPrisma.set("category", "count", spy);

		const res = await duploTesting
			.testRoute(GET("GET", "/categories-count"))
			.launch();

		expect(res.information).toBe("categoriesCount");
		expect(spy).toHaveBeenCalled();
	});
});
