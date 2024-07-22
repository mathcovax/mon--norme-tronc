import { duploTesting } from "@test/setup";
import { adminPanelEntry, authEntry, basicEntry, contentPanelEntry, organizationOwnerEntry, organizationEntry, organizationProductSheetManagerEntry, selfEntry } from "./entry";

describe("entry", () => {
	it("basic", async () => {
		const res = await duploTesting
			.testRoute(basicEntry)
			.launch();

		expect(res.information).toBe("entry.accepted");
	});

	it("adminPanel", async () => {
		const res = await duploTesting
			.testRoute(adminPanelEntry)
			.launch();

		expect(res.information).toBe("entry.accepted");
	});

	it("contentPanel", async () => {
		const res = await duploTesting
			.testRoute(contentPanelEntry)
			.launch();

		expect(res.information).toBe("entry.accepted");
	});

	it("auth", async () => {
		const res1 = await duploTesting
			.testRoute(authEntry)
			.mockChecker(0, { info: "", data: null })
			.launch();

		expect(res1.information).toBe("entry.refuse");

		const res3 = await duploTesting
			.testRoute(authEntry)
			.launch();

		expect(res3.information).toBe("entry.accepted");
	});

	it("organization", async () => {
		const res = await duploTesting
			.testRoute(organizationEntry)
			.setDefaultFloorValue({ user: {} })
			.setRequestProperties({
				params: {
					organizationId: "tete"
				}
			})
			.mockChecker(
				0,
				{ info: "organization.hasNotUser", data: null }
			)
			.launch();

		expect(res.information).toBe("entry.refuse");

		const res1 = await duploTesting
			.testRoute(organizationEntry)
			.setDefaultFloorValue({ user: {} })
			.setRequestProperties({
				params: {
					organizationId: "tete"
				}
			})
			.mockChecker(
				0,
				{ info: "organization.hasUser", data: null }
			)
			.launch();

		expect(res1.information).toBe("entry.accepted");
	});

	it("product sheet manager", async () => {
		const res = await duploTesting
			.testRoute(organizationProductSheetManagerEntry)
			.setDefaultFloorValue({ user: {} })
			.setRequestProperties({
				params: {
					organizationId: "audit tete"
				}
			})
			.mockChecker(
				0,
				{ info: "productSheet.exist", data: "1234" }
			)
			.mockProcess(
				1,
				{}
			)
			.launch();

		expect(res.information).toBe("entry.accepted");

		const res1 = await duploTesting
			.testRoute(organizationProductSheetManagerEntry)
			.setDefaultFloorValue({ user: {} })
			.setRequestProperties({
				params: {
					organizationId: "audit tete",
					productSheetId: "tttt"
				}
			})
			.mockChecker(
				0,
				{ info: "productSheet.notfound", data: "1234" }
			)
			.mockProcess(
				1,
				{}
			)
			.launch();

		expect(res1.information).toBe("entry.refuse");
	});

	it("organization owner", async () => {
		const res = await duploTesting
			.testRoute(organizationOwnerEntry)
			.setDefaultFloorValue({ user: {} })
			.setRequestProperties({
				params: {
					organizationId: "tete"
				}
			})
			.mockProcess(
				0,
				{}
			)
			.launch();

		expect(res.information).toBe("entry.accepted");
	});

	it("selfEntry", async () => {
		const res = await duploTesting
			.testRoute(selfEntry)
			.setDefaultFloorValue({ user: {} })
			.launch();

		expect(res.information).toBe("entry.accepted");
	});
});
