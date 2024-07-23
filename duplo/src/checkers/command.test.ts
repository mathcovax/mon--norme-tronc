import { duploTesting } from "@test/setup";
import { commandExistCheck } from "./command";
import { MockPrisma } from "@test/mocks/providers";

describe("command checker", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("find by id", async () => {
		const command = {};
		const spy = vi.fn(async () => command);
		MockPrisma.set("command", "findFirst", spy);

		const res = await duploTesting
			.testChecker(commandExistCheck, "test");

		expect(spy).lastCalledWith({
			where: { id: "test" }
		});
		expect(res.info).toBe("command.exist");
	});

	it("notfound", async () => {
		MockPrisma.set("command", "findFirst", () => null);
		const res = await duploTesting
			.testChecker(commandExistCheck, "143535");

		expect(res.info).toBe("command.notfound");
	});
});
