import { MockPrisma } from "@test/mocks/providers";
import { ProductAvailability } from "./productAvailability";

describe("Product Avaibility Service", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("if result undefined should return 0", async () => {
		const spy = vi.fn(async () => [undefined]);
		// @ts-expect-error global cause type error.
		global.prisma.$queryRaw = spy;
		const result = await ProductAvailability.quantity("1234");
		expect(result).toBe(0);
	});

	it("should return count", async () => {
		const spy = vi.fn(async () => [{ count: 10 }]);
		// @ts-expect-error global cause type error.
		global.prisma.$queryRaw = spy;
		const result = await ProductAvailability.quantity("1234");
		expect(result).toBe(10);
	});
});
