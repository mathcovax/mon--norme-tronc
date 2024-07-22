import { duploTesting } from "@test/setup";
import { productData } from "@test/data/product";
import { hasOrganizationRoleBySku } from "./bySku";
import { Response } from "@duplojs/duplojs";

describe("hasOrganizationRoleBySku", () => {
	it("product notfound", async () => {
		const res: Response = await duploTesting
			.testAbstractRoute(hasOrganizationRoleBySku.abstractRoute)
			.setRequestProperties({
				params: {
					sku: "tete"
				},
			})
			.mockChecker(
				0,
				{ info: "product.notfound", data: null }
			)
			.launch();
		expect(res.information).toBe("product.notfound");
	});

	it("product exist", async () => {
		const res = await duploTesting
			.testAbstractRoute(hasOrganizationRoleBySku.abstractRoute)
			.setDefaultFloorValue({ user: {} })
			.setRequestProperties({
				params: {
					sku: "tete"
				},
			})
			.mockChecker(
				0,
				{ info: "product.exist", data: productData }
			)
			.mockProcess(
				1,
				{}
			)
			.launch();

		expect(res).toStrictEqual({
			user: {},
			product: productData
		});
	});
});
