import { duploTesting } from "@test/setup";
import { hasOrganizationRoleByOrganizationId } from "./byOrganizationId";
import { Response } from "@duplojs/duplojs";
import { organizationData } from "@test/data/organization";

describe("hasOrganizationRoleByOrganizationId", () => {
	it("organization not found" , async () => {
		const res: Response = await duploTesting
			.testAbstractRoute(hasOrganizationRoleByOrganizationId.abstractRoute)
			.setRequestProperties({
				params: {
					organizationId: "zzz"
				}
			})
			.mockChecker(0, { info: "organization.notfound", data: null })
			.launch();

		expect(res.information).toBe("organization.notfound");
	});

	it("pass" , async () => {
		const res = await duploTesting
			.testAbstractRoute(hasOrganizationRoleByOrganizationId.abstractRoute)
			.setDefaultFloorValue({ user: {} })
			.setRequestProperties({
				params: {
					organizationId: "zzz"
				}
			})
			.mockChecker(0, { info: "organization.exist", data: organizationData })
			.launch();

		expect(res).toStrictEqual({
			user: {},
			organization: organizationData,
		});
	});
});
