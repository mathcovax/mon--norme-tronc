import { MockPrisma } from "@test/mocks/providers";
import { duploTesting } from "@test/setup";
import { DELETE, PATCH } from "./{facetType}";
import { productSheetData } from "@test/data/productSheet";
import { facetData } from "@test/data/facet";

describe("/product-sheets/{productSheetId}/facets/{facetType}", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});
	
	describe("DELETE", () => {
		it("facet notfound", async () => {
			const res = await duploTesting
				.testRoute(DELETE("DELETE", ""))
				.setDefaultFloorValue({
					productSheet: productSheetData
				})
				.setRequestProperties({
					params: {
						facetType: "COLOR"
					}
				})
				.mockChecker(0, { info: "facet.notfound", data: null })
				.launch();
	
			expect(res.information).toBe("facet.notfound");
		});

		it("delete facet", async () => {
			const spy = vi.fn(() => null);
			MockPrisma.set("facet", "delete", spy);

			const res = await duploTesting
				.testRoute(DELETE("DELETE", ""))
				.setDefaultFloorValue({
					productSheet: productSheetData
				})
				.setRequestProperties({
					params: {
						facetType: "COLOR"
					}
				})
				.mockChecker(0, { info: "facet.exist", data: facetData })
				.launch();
	
			expect(res.information).toBe("facet.deleted");
			expect(spy).lastCalledWith({
				where: {
					type_productSheetId: {
						type: "COLOR",
						productSheetId: ""
					}
				}
			});
		});
	});

	describe("PATCH", () => {
		it("facet notfound", async () => {
			const res = await duploTesting
				.testRoute(PATCH("PATCH", ""))
				.setDefaultFloorValue({
					productSheet: productSheetData
				})
				.setRequestProperties({
					params: {
						facetType: "COLOR"
					}
				})
				.mockChecker(0, { info: "facet.notfound", data: null })
				.launch();
	
			expect(res.information).toBe("facet.notfound");
		});

		it("patch facet", async () => {
			const spy = vi.fn(() => null);
			MockPrisma.set("facet", "update", spy);

			const res = await duploTesting
				.testRoute(PATCH("PATCH", ""))
				.setDefaultFloorValue({
					productSheet: productSheetData
				})
				.setRequestProperties({
					params: {
						facetType: "COLOR"
					},
					body: {
						value: "toto"
					}
				})
				.mockChecker(0, { info: "facet.exist", data: facetData })
				.launch();
	
			expect(res.information).toBe("facet.edited");
			expect(spy).lastCalledWith({
				where: {
					type_productSheetId: {
						type: "COLOR",
						productSheetId: ""
					}
				},
				data: {
					value: "toto"
				}
			});
		});
	});
});
