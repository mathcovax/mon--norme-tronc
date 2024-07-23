import { duploTesting } from "@test/setup";
import { GET } from ".";
import { userToOrganizationData } from "@test/data/userToOrganization";
import { userData } from "@test/data/user";

describe("GET /organizations/{organizationId}/user", () => {
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
