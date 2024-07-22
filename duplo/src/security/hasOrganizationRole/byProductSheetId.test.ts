import { duploTesting } from "@test/setup";
import { Response } from "@duplojs/duplojs";
import { hasOrganizationRoleByProductSheetId } from "./byProductSheetId";
import { productSheetData } from "@test/data/productSheet";

describe("hasOrganizationRoleByProductSheetId", () => {
	it("productSheet not found" , async () => {
		const res: Response = await duploTesting
			.testAbstractRoute(hasOrganizationRoleByProductSheetId.abstractRoute)
			.setRequestProperties({
				params: {
					productSheetId: "zzz"
				}
			})
			.mockChecker(0, { info: "productSheet.notfound", data: null })
			.launch();

		expect(res.information).toBe("productSheet.notfound");
	});

	it("pass" , async () => {
		const res = await duploTesting
			.testAbstractRoute(hasOrganizationRoleByProductSheetId.abstractRoute)
			.setDefaultFloorValue({ user: {} })
			.setRequestProperties({
				params: {
					productSheetId: "zzz"
				}
			})
			.mockChecker(0, { info: "productSheet.exist", data: productSheetData })
			.launch();

		expect(res).toStrictEqual({
			user: {},
			productSheet: productSheetData,
		});
	});
});
