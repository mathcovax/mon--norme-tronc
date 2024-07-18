import { duploTesting } from "@test/setup";
import { GET } from ".";
import { MockPrisma } from "@test/mocks/providers";
import { newsletterData } from "@test/data/newsletter";

describe("GET /newsletters", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("get newsletters", async () => {
		const spy = vi.fn(async () => [newsletterData]);
		MockPrisma.set("newsletter", "findMany", spy);

		const res = await duploTesting
			.testRoute(GET("GET", ""))
			.setRequestProperties({
				query: {
					page: 2,
					object: "title"
				}
			})
			.launch();
		
		expect(res.information).toBe("newsletters");
		expect(spy).lastCalledWith({
			where: {
				object: {
					contains: "title",
					mode: "insensitive"
				}
			},
			skip: 20,
			take: 10
		});
	});
});
