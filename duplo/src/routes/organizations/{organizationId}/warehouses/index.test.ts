import { MockPrisma } from "@test/mocks/providers";
import { duploTesting } from "@test/setup";
import { GET, POST } from ".";
import { organizationData } from "@test/data/organization";
import { warehouseData } from "@test/data/warehouse";

describe("GET /organization/{organizationId}/warehouses", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("get warehouse", async () => {
		const spy = vi.fn(() => []);
		MockPrisma.set("warehouse", "findMany", spy);

		const res = await duploTesting
			.testRoute(GET("GET", ""))
			.setDefaultFloorValue({ organization: organizationData })
			.setRequestProperties({
				query: {
					name: "eeee",
				}
			})
			.launch();

		expect(spy).lastCalledWith({
			where: {
				organizationId: "eee",
				name: {
					contains: "eeee",
					mode: "insensitive",
				}
			},
			skip: 0,
			take: 10,
		});
		expect(res.information).toBe("warehouses.found");
	});
});

describe("POST /organizations/{organizationId}/warehouse", async () => {
	beforeEach(() => {
		MockPrisma.reset();
	});
	
	it("post warehouse", async () => {
		const spy = vi.fn(() => warehouseData);
		MockPrisma.set("warehouse", "create", spy);

		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setDefaultFloorValue({ organization: organizationData })
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
		
		expect(res.information).toBe("warehouse.created");
		expect(spy).lastCalledWith({
			data: {
				name: "audit",
				address: "3 rue de la paix",
				organizationId: "eee"
			}
		});
	});

	it("address notfound", async () => {
		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setDefaultFloorValue({ organization: organizationData })
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

