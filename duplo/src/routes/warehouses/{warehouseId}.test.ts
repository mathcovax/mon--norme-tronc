import { MockPrisma } from "@test/mocks/providers";
import { PATCH } from "./{warehouseId}";
import { duploTesting } from "@test/setup";
import { warehouseData } from "@test/data/warehouse";

describe("PATCH /warehouses/{warehouseId}", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("update warehouse", async () => {
		const spy = vi.fn(() => warehouseData);
		MockPrisma.set("warehouse", "update", spy);

		const res = await duploTesting
			.testRoute(PATCH("PATCH", ""))
			.setDefaultFloorValue({ warehouse: warehouseData })
			.setRequestProperties({
				body: {
					name: "audit",
					address: "3 rue de la paix",
				}
			})
			.mockChecker(
				0,
				{ info: "address.valid", data: "zeub" }
			)
			.launch();
		
		expect(res.information).toBe("warehouse.edited");
		expect(spy).lastCalledWith({
			where: {
				id: "tete"
			},
			data: {
				name: "audit",
				address: "3 rue de la paix",
			},
		});
	});

	it("address notfound", async () => {
		const res = await duploTesting
			.testRoute(PATCH("PATCH", ""))
			.setDefaultFloorValue({ warehouse: warehouseData })
			.setRequestProperties({
				body: {
					name: "audit",
					address: "3 rue de la paix",
				}
			})
			.mockChecker(
				0,
				{ info: "warehouse.address.invalid", data: "zeub" }
			)
			.launch();
		
		expect(res.information).toBe("warehouse.address.invalid");
	});
});
