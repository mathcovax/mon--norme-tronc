import { duploTesting } from "@test/setup";
import { MockPrisma } from "@test/mocks/providers";
import { userData } from "@test/data/user";
import { organizationData } from "@test/data/organization";
import { POST } from ".";
import { GET } from ".";
import { userToOrganizationData } from "@test/data/userToOrganization";

describe("POST /organizations/{organizationId}/users", () => {
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

describe("GET /organization/{organizationId}/users", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("get organization users", async () => {
		const spy = vi.fn(
			async () => [userToOrganizationData].map(v => ({ ...v, user: userData }))
		);
		MockPrisma.set("user_to_organization", "findMany", spy);

		const res = await duploTesting.testRoute(GET("GET", ""))
			.setDefaultFloorValue({ organization: organizationData })
			.setRequestProperties({
				query: {
					page: 2,
					email: "toto",
				}
			})
			.launch();
			
		expect(res.information).toBe("organization.users");
		expect(spy).lastCalledWith({
			where: {
				organizationId: "eee",
				user: {
					email: {
						contains: "toto",
						mode: "insensitive",
					}
				}
			},
			select: {
				organizationRole: true,
				user: true
			},
			take: 10,
			skip: 20,
		});
	});
});
