import { duploTesting } from "@test/setup";
import { MockPrisma } from "@test/mocks/providers";
import { GET, POST } from ".";
import { userData } from "@test/data/user";
import { userToOrganizationData } from "@test/data/userToOrganization";
import { organizationData } from "@test/data/organization";

describe("/organization/{organizationId}/user", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	describe("POST", () => {
		it("user not exist", async () => {
			const res = await duploTesting
				.testRoute(POST("POST", ""))
				.setDefaultFloorValue({ organization: organizationData })
				.setRequestProperties({
					params: {
						userId: "ee"
					},
					body: {
						email: "eeee",
						firstname: "zzz",
						lastname: "tttt",
						organizationRole: "ACCOUNTANT",
					}
				})
				.mockChecker(
					0,
					{ info: "user.notfound", data: null }
				)
				.launch();
				
			expect(res.information).toBe("user.notfound");
		});
	
		it("organization has already user", async () => {
			const res = await duploTesting
				.testRoute(POST("POST", ""))
				.setDefaultFloorValue({ organization: organizationData })
				.setRequestProperties({
					params: {
						userId: "ee"
					},
					body: {
						email: "eeee",
						firstname: "zzz",
						lastname: "tttt",
						organizationRole: "ACCOUNTANT",
					}
				})
				.mockChecker(
					0,
					{ info: "user.exist", data: userData }
				)
				.mockChecker(
					1,
					{ info: "organization.hasUser", data: null }
				)
				.launch();
				
			expect(res.information).toBe("organization.hasAlreadyUser");
		});
	
		it("add user to organization", async () => {
			const spy = vi.fn(async () => null);
			MockPrisma.set("user_to_organization", "create", spy);
				
			const res = await duploTesting
				.testRoute(POST("POST", ""))
				.setDefaultFloorValue({ organization: organizationData })
				.setRequestProperties({
					params: {
						userId: "ee"
					},
					body: {
						email: "eeee",
						firstname: "zzz",
						lastname: "tttt",
						organizationRole: "ACCOUNTANT",
					}
				})
				.mockChecker(
					0,
					{ info: "user.exist", data: userData }
				)
				.mockChecker(
					1,
					{ info: "organization.hasNotUser", data: null }
				)
				.launch();
				
			expect(res.information).toBe("organization.user.add");
			expect(spy).lastCalledWith({
				data: {
					organizationId: "eee",
					userId: "rere",
					organizationRole: "ACCOUNTANT",
				}
			});
		});
	});

	describe("GET", () => {
		it("organization has not user", async () => {
			const res = await duploTesting
				.testRoute(GET("GET", ""))
				.setDefaultFloorValue({ user: {}, })
				.setRequestProperties({
					params: { organizationId: "" }
				})
				.mockChecker(0, { info: "organization.hasNotUser", data: null })
				.launch();

			expect(res.information).toBe("organization.hasNotUser");
		});

		it("get user organization", async () => {
			const res = await duploTesting
				.testRoute(GET("GET", ""))
				.setDefaultFloorValue({ user: {}, })
				.setRequestProperties({
					params: { organizationId: "" }
				})
				.mockChecker(0, { info: "organization.hasUserWithMoreData", data: { ...userToOrganizationData, user: userData } })
				.launch();

			expect(res.information).toBe("organization.user");
		});
	});
});
