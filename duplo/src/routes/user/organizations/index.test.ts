import { duploTesting } from "@test/setup";
import { GET } from ".";
import { MockPrisma } from "@test/mocks/providers";
import { userData } from "@test/data/user";
import { organizationData } from "@test/data/organization";
import { userToOrganizationData } from "@test/data/userToOrganization";

describe("/user/organizations", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("get user's organizations", async () => {
		const spy = vi.fn(
			async () => [userToOrganizationData].map(v => ({ ...v, organization: organizationData }))
		);
		MockPrisma.set("user_to_organization", "findMany", spy);

		const res = await duploTesting.testRoute(GET("GET", ""))
			.setDefaultFloorValue({
				user: { id: "" }
			})
			.setRequestProperties({
				query: {
					page: 2
				}
			})
			.mockChecker(
				0,
				{
					info: "user.exist",
					data: userData
				}
			)
			.launch();

		expect(res.information).toBe("user.organizations");
		expect(spy).lastCalledWith({
			where: {
				user: {
					id: userData.id
				}
			},
			select: {
				organization: true
			},
			take: 10,
			skip: 20
		});
	});
});
