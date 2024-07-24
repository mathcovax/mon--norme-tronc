import { duploTesting } from "@test/setup";
import { GET, POST } from ".";
import { productSheetData } from "@test/data/productSheet";
import { MockPrisma } from "@test/mocks/providers";
import { facetData } from "@test/data/facet";

describe("POST /product-sheets/{productSheetId}/facets", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("facet notfound", async () => {
		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setDefaultFloorValue({
				productSheet: productSheetData
			})
			.setRequestProperties({
				params: {
					facetType: "COLOR"
				},
				body: facetData
			})
			.mockChecker(0, { info: "facet.exist", data: null })
			.launch();

		expect(res.information).toBe("productSheet.facet.alreadyExist");
	});

	it("post facet", async () => {
		const spy = vi.fn(() => facetData);
		MockPrisma.set("facet", "create", spy);

		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setDefaultFloorValue({
				productSheet: productSheetData
			})
			.setRequestProperties({
				params: {
					facetType: "COLOR"
				},
				body: facetData
			})
			.mockChecker(0, { info: "facet.notfound", data: null })
			.launch();

		expect(res.information).toBe("facet.created");
		expect(spy).lastCalledWith({
			data: {
				...facetData,
				productSheetId: "",
			}
		});
	});
});

describe("GET /product-sheets/{productSheetId}/facets", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("find facets", async () => {
		const spy = vi.fn(() => [facetData]);
		MockPrisma.set("facet", "findMany", spy);

		const res = await duploTesting
			.testRoute(GET("GET", ""))
			.setDefaultFloorValue({
				productSheet: productSheetData
			})
			.launch();

		expect(res.information).toBe("productSheet.facets");
		expect(spy).lastCalledWith({
			take: 7,
			where: {
				productSheetId: ""
			}
		});
	});
});
