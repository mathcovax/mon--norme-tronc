import { duploTesting } from "@test/setup";
import { GET } from ".";
import { fullProductSheetModel } from "@mongoose/model";
import { fullProductSheetData } from "@test/data/fullProductSheet";

vi.mock("@mongoose/model");

describe("GET /full-product-sheets/{fullProductSheetId}", () => {
	it("fullProductSheet notfound", async () => {
		const spy = vi.spyOn(fullProductSheetModel, "findOne").mockResolvedValue(null);

		const res = await duploTesting
			.testRoute(GET("GET", ""))
			.setRequestProperties({
				params: {
					productSheetId: "test"
				}
			})
			.launch();

		expect(res.information).toBe("fullProductSheet.notfound");
		expect(spy).lastCalledWith({ id: "test" });
	});

	it("find fullProductSheet", async () => {
		const spy = vi.spyOn(fullProductSheetModel, "findOne").mockResolvedValue({ toJSON: () => fullProductSheetData });

		const res = await duploTesting
			.testRoute(GET("GET", ""))
			.setRequestProperties({
				params: {
					productSheetId: "test"
				}
			})
			.launch();

		expect(res.information).toBe("fullProductSheet");
		expect(spy).lastCalledWith({ id: "test" });
	});
});

