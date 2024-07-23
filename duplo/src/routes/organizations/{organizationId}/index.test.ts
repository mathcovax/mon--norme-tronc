import { organizationData } from "@test/data/organization";
import { MockPrisma } from "@test/mocks/providers";
import { duploTesting } from "@test/setup";
import { GET, PATCH } from "./index";

describe("/organizations/{organizationId}", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	describe("PATCH",() => {
		it("update organization", async () => {
			const spy = vi.fn(() => organizationData);
			MockPrisma.set("organization", "update", spy);

			const res = await duploTesting
				.testRoute(PATCH("PATCH", "/organization/1234"))
				.setDefaultFloorValue({ organization: organizationData })
				.setRequestProperties({
					body: {
						label: "test"
					}
				})
				.launch();

			expect(res.information).toBe("organization.edited");
			expect(spy).lastCalledWith({
				where: {
					id: "eee"
				},
				data: {
					label: "test"
				},
			});
		});
	});

	describe("GET", () => {
		it("get organization by id", async () => {
			const res = await duploTesting
				.testRoute(GET("GET", "/organization/1234"))
				.setDefaultFloorValue({ organization: organizationData })
				.launch();
	
			expect(res.information).toBe("organization.found");
		});
	});
});
