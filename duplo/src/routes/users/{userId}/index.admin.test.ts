import { duploTesting } from "@test/setup";
import { PATCH } from "./index.admin";
import { MockPrisma } from "@test/mocks/providers";

describe("GET /users/{userId}", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("patch user not found", async () => {
		const res = await duploTesting
			.testRoute(PATCH("PATCH", ""))
			.setRequestProperties({
				params: {
					userId: "test"
				}
			})
			.mockChecker(
				0,
				{
					info: "user.notfound",
					data: null
				}
			)
			.launch();

		expect(res.information).toBe("user.notfound");
	});

	it("patc user primordialRole ADMIN", async () => {
		const res = await duploTesting
			.testRoute(PATCH("PATCH", ""))
			.setRequestProperties({
				params: {
					userId: "test"
				}
			})
			.mockChecker(
				0,
				{
					info: "user.exist",
					data: {
						primordialRole: "ADMIN"
					}
				}
			)
			.launch();

		expect(res.information).toBe("user.primordialRole.admin");
	});

	it("patc user", async () => {
		const spy = vi.fn(() => undefined);
		MockPrisma.set("user", "update", spy);

		const res = await duploTesting
			.testRoute(PATCH("PATCH", ""))
			.setRequestProperties({
				params: {
					userId: "test"
				},
				body: {
					muted: true,
					primordialRole: "MODERATOR",
				}
			})
			.mockChecker(
				0,
				{
					info: "user.exist",
					data: {
						primordialRole: "MODERATOR"
					}
				}
			)
			.launch();

		expect(res.information).toBe("user.edited");
		expect(spy).lastCalledWith({
			where: { id: "test" },
			data: { muted: true, primordialRole: "MODERATOR" }
		});
	});
});
