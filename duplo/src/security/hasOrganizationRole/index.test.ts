import { duploTesting } from "@test/setup";
import { hasOrganizationRole } from ".";
import { Response } from "@duplojs/duplojs";
import { userToOrganizationData } from "@test/data/userToOrganization";

describe("hasOrganizationRole", () => {
	it("missing input", async () => {
		const error = await duploTesting
			.testProcess(hasOrganizationRole)
			.setDefaultFloorValue({
				user: { primordialRole: "ADMIN" },
			})
			.launch();

		expect(error).instanceOf(Error);
	});

	it("organization has not user", async () => {
		const res: Response = await duploTesting
			.testProcess(hasOrganizationRole)
			.setDefaultFloorValue({
				user: { primordialRole: "ADMIN" },
				input: {
					organizationId: "input.organizationId",
					userId: "input.userId"
				},
			})
			.mockChecker(1, { info: "organization.hasNotUser", data: null })
			.launch();


		expect(res.information).toBe("organization.hasNotUser");
	});

	it("user has wrong role", async () => {
		const res: Response = await duploTesting
			.testProcess(hasOrganizationRole)
			.setDefaultFloorValue({
				user: { primordialRole: "ADMIN" },
				input: {
					organizationId: "input.organizationId",
					userId: "input.userId"
				},
			})
			.mockChecker(1, { info: "organization.hasUser", data: userToOrganizationData })
			.launch();


		expect(res.information).toBe("user.role.organization.invalid");
	});

	it("user has role", async () => {
		const res: Response = await duploTesting
			.testProcess(hasOrganizationRole)
			.setDefaultFloorValue({
				user: { primordialRole: "ADMIN" },
				input: {
					organizationId: "input.organizationId",
					userId: "input.userId"
				},
			})
			.mockChecker(1, { info: "organization.hasUser", data: { ...userToOrganizationData, organizationRole: "OWNER" } })
			.launch();


		expect(res).toStrictEqual({
			userToOrganization: {
				organizationId: "test",
				organizationRole: "OWNER",
				userId: "tata",
			},
		});
	});
});
