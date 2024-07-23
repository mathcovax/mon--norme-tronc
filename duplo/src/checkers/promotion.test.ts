import { duploTesting } from "@test/setup";
import { promotionExistCheck } from "./promotion";
import { MockPrisma } from "@test/mocks/providers";

describe("promotion checker", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("find by id", async () => {
		const promotion = {};
		const spy = vi.fn(async () => promotion);
		MockPrisma.set("promotion", "findFirst", spy);

		const res = await duploTesting
			.testChecker(promotionExistCheck, 123);

		expect(spy).lastCalledWith({
			where: { id: 123 }
		});
		expect(res.info).toBe("promotion.exist");
	});

	it("notfound", async () => {
		MockPrisma.set("promotion", "findFirst", () => null);
		const res = await duploTesting
			.testChecker(promotionExistCheck, 143535);

		expect(res.info).toBe("promotion.notfound");
	});
});
