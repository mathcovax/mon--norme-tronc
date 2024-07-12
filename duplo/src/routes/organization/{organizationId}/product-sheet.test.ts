import { MockPrisma } from "@test/mocks/providers";
import { POST } from "./product-sheet";
import { duploTesting } from "@test/setup";
import { organizationData } from "@test/data/organization";
import { productSheetData } from "@test/data/productSheet";
import { warehouseData } from "@test/data/warehouse";

describe("POST /organization/{organizationId}/product-sheet", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("warehouse notfound", async () => {
		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setDefaultFloorValue({ organization: organizationData })
			.setRequestProperties({
				body: {
					ref: "119112",
					name: "test",
					description: "test",
					shortDescription: "test",
					price: 10,
					warehouseId: "toto"
				}
			})
			.mockChecker(
				0,
				{ info: "warehouse.notfound", data: null }
			)
			.launch();

		expect(res.information).toBe("warehouse.notfound");
	});

	it("post product sheet created", async () => {
		const spy = vi.fn(() => productSheetData);
		MockPrisma.set("product_sheet", "create", spy);
		MockPrisma.set("product_sheet", "count", () => 0);

		const res = await duploTesting
			.testRoute(POST("POST", "/organization/1234/product-sheet"))
			.setDefaultFloorValue({ organization: organizationData })
			.setRequestProperties({
				body: {
					ref: "119112",
					name: "test",
					description: "test",
					shortDescription: "test",
					price: 10,
					warehouseId: "toto"
				}
			})
			.mockChecker(
				0,
				{ info: "warehouse.exist", data: warehouseData }
			)
			.launch();

		expect(res.information).toBe("productSheet.created");
		expect(spy).lastCalledWith({
			data: {
				ref: "119112",
				description: "test",
				name: "test",
				organizationId: "eee",
				shortDescription: "test",
				price: 10,
				warehouseId: "toto",
			}
		});
	});
});
