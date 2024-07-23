import { duploTesting } from "@test/setup";
import { productReturnExistCheck } from "./productReturn";
import { MockPrisma } from "@test/mocks/providers";

describe("productReturn checker", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("find by id", async () => {
		const productReturn = {};
		const spy = vi.fn(async () => productReturn);
		MockPrisma.set("product_return", "findFirst", spy);

		const res = await duploTesting
			.testChecker(productReturnExistCheck, 123);

		expect(spy).lastCalledWith({
			where: { id: 123 }
		});
		expect(res.info).toBe("productReturn.exist");
	});

	it("notfound", async () => {
		MockPrisma.set("product_return", "findFirst", () => null);
		const res = await duploTesting
			.testChecker(productReturnExistCheck, 143535);

		expect(res.info).toBe("productReturn.notfound");
	});
});
