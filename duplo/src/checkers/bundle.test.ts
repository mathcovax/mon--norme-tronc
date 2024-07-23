import { duploTesting } from "@test/setup";
import { bundleExistCheck } from "./bundle";
import { MockPrisma } from "@test/mocks/providers";

describe("bundle checker", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("find by id", async () => {
		const bundle = {};
		const spy = vi.fn(async () => bundle);
		MockPrisma.set("bundle", "findFirst", spy);

		const res = await duploTesting
			.testChecker(bundleExistCheck, 123);

		expect(spy).lastCalledWith({
			where: { id: 123 }
		});
		expect(res.info).toBe("bundle.exist");
	});

	it("notfound", async () => {
		MockPrisma.set("bundle", "findFirst", () => null);
		const res = await duploTesting
			.testChecker(bundleExistCheck, 143535);

		expect(res.info).toBe("bundle.notfound");
	});
});

