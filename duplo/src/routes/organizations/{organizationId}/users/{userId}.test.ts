import { duploTesting } from "@test/setup";
import { MockPrisma } from "@test/mocks/providers";
import { DELETE, PATCH } from "./{userId}";

describe("/organizations/{organizationId}/users/{userId}", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	describe("PATCH", () => {
		it("organization has not user", async () => {
			const res = await duploTesting
				.testRoute(PATCH("PATCH", ""))
				.setDefaultFloorValue({ user: {} })
				.setRequestProperties({
					params: {
						organizationId: "tt",
						userId: "ee"
					},
					body: {
						organizationRole: "STORE_KEEPER"
					}
				})
				.mockProcess(0, {})
				.mockChecker(
					1,
					{ info: "organization.hasNotUser", data: null }
				)
				.launch();
			
			expect(res.information).toBe("organization.hasNotUser");
		});

		it("patch owner user", async () => {
			const res = await duploTesting
				.testRoute(PATCH("PATCH", ""))
				.setDefaultFloorValue({ user: {} })
				.setRequestProperties({
					params: {
						organizationId: "tt",
						userId: "ee"
					},
					body: {
						organizationRole: "STORE_KEEPER"
					}
				})
				.mockProcess(0, {})
				.mockChecker(
					1,
					{ info: "organization.hasUser", data: { organizationRole: "OWNER" } }
				)
				.launch();
			
			expect(res.information).toBe("organization.user.organizationRole.owner");
		});

		it("patch user", async () => {
			const spy = vi.fn(async () => null);
			MockPrisma.set("user_to_organization", "update", spy);
			
			const res = await duploTesting
				.testRoute(PATCH("PATCH", ""))
				.setDefaultFloorValue({ user: {} })
				.setRequestProperties({
					params: {
						organizationId: "tt",
						userId: "ee"
					},
					body: {
						organizationRole: "STORE_KEEPER"
					}
				})
				.mockProcess(0, {})
				.mockChecker(
					1,
					{ info: "organization.hasUser", data: { organizationRole: "STORE_KEEPER" } }
				)
				.launch();
			
			expect(res.information).toBe("organization.user.edited");
			expect(spy).lastCalledWith({
				where: {
					userId_organizationId: {
						organizationId: "tt",
						userId: "ee",
					}
				},
				data: {
					organizationRole: "STORE_KEEPER",
				}
			});
		});
	});

	describe("DELETE", () => {
		it("organization has not user", async () => {
			const res = await duploTesting
				.testRoute(DELETE("DELETE", ""))
				.setDefaultFloorValue({ user: {} })
				.setRequestProperties({
					params: {
						organizationId: "tt",
						userId: "ee"
					},
					body: {
						organizationRole: "STORE_KEEPER"
					}
				})
				.mockProcess(0, {})
				.mockChecker(
					1,
					{ info: "organization.hasNotUser", data: null }
				)
				.launch();
			
			expect(res.information).toBe("organization.hasNotUser");
		});

		it("delete owner user", async () => {
			const res = await duploTesting
				.testRoute(DELETE("DELETE", ""))
				.setDefaultFloorValue({ user: {} })
				.setRequestProperties({
					params: {
						organizationId: "tt",
						userId: "ee"
					},
					body: {
						organizationRole: "STORE_KEEPER"
					}
				})
				.mockProcess(0, {})
				.mockChecker(
					1,
					{ info: "organization.hasUser", data: { organizationRole: "OWNER" } }
				)
				.launch();
			
			expect(res.information).toBe("organization.user.organizationRole.owner");
		});

		it("delete user", async () => {
			const spy = vi.fn(async () => null);
			MockPrisma.set("user_to_organization", "delete", spy);
			
			const res = await duploTesting
				.testRoute(DELETE("DELETE", ""))
				.setDefaultFloorValue({ user: {} })
				.setRequestProperties({
					params: {
						organizationId: "tt",
						userId: "ee"
					},
					body: {
						organizationRole: "STORE_KEEPER"
					}
				})
				.mockProcess(0, {})
				.mockChecker(
					1,
					{ info: "organization.hasUser", data: { organizationRole: "STORE_KEEPER" } }
				)
				.launch();
			
			expect(res.information).toBe("organization.user.deleted");
			expect(spy).lastCalledWith({
				where: {
					userId_organizationId: {
						organizationId: "tt",
						userId: "ee",
					}
				}
			});
		});
	});
});
