import { duploTesting } from "@test/setup";
import { warehouseData } from "@test/data/warehouse";
import { hasOrganizationRoleByWarehouseId } from "./byWarehouseId";
import { Response } from "@duplojs/duplojs";

describe("hasOrganizationRoleByWarehouseId", () => {
	it("warehouse notfound", async () => {
		const res: Response = await duploTesting
			.testAbstractRoute(hasOrganizationRoleByWarehouseId.abstractRoute)
			.setRequestProperties({
				params: {
					warehouseId: "tete"
				},
			})
			.mockChecker(
				0,
				{ info: "warehouse.notfound", data: null }
			)
			.launch();
		expect(res.information).toBe("warehouse.notfound");
	});

	it("warehouse exist", async () => {
		const res = await duploTesting
			.testAbstractRoute(hasOrganizationRoleByWarehouseId.abstractRoute)
			.setDefaultFloorValue({ user: {} })
			.setRequestProperties({
				params: {
					warehouseId: "tete"
				},
			})
			.mockChecker(
				0,
				{ info: "warehouse.exist", data: warehouseData }
			)
			.launch();

		expect(res).toStrictEqual({
			user: {},
			warehouse: warehouseData
		});
	});
});
