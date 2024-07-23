import { duploTesting } from "@test/setup";
import { newsletterExistCheck } from "./newsletter";
import { MockPrisma } from "@test/mocks/providers";

describe("newsletter checker", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("find by id", async () => {
		const newsletter = {};
		const spy = vi.fn(async () => newsletter);
		MockPrisma.set("newsletter", "findFirst", spy);

		const res = await duploTesting
			.testChecker(newsletterExistCheck, "test");

		expect(spy).lastCalledWith({
			where: { id: "test" }
		});
		expect(res.info).toBe("newsletter.exist");
	});

	it("notfound", async () => {
		MockPrisma.set("newsletter", "findFirst", () => null);
		const res = await duploTesting
			.testChecker(newsletterExistCheck, "143535");

		expect(res.info).toBe("newsletter.notfound");
	});
});
