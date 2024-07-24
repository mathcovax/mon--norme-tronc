import { MockPrisma } from "@test/mocks/providers";
import { PATCH, GET } from "./{productSheetId}";
import { duploTesting } from "@test/setup";
import { productSheetData } from "@test/data/productSheet";

describe("/product-sheets/{productSheetId}", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	describe("PATCH", () => {
		it("update product sheet", async () => {
			const spy = vi.fn(() => productSheetData);
			MockPrisma.set("product_sheet", "update", spy);
	
			const res = await duploTesting
				.testRoute(PATCH("PATCH", "/product-sheet/1234"))
				.setDefaultFloorValue({ productSheet: productSheetData })
				.setRequestProperties({
					body: {
						name: "test",
						description: "la grosse tete de mathieu",
						shortDescription: "la grosse tete de mathieu",
						price: 10
					}
				})
				.launch();
	
			expect(res.information).toBe("productSheet.edited");
			expect(spy).lastCalledWith({
				where: {
					id: ""
				},
				data: {
					name: "test",
					description: "la grosse tete de mathieu",
					shortDescription: "la grosse tete de mathieu",
					price: 10,
					status: "UNVERIFIED",
				},
			});
		});
	});

	describe("GET", () => {
		it("get product sheet by id", async () => {
			const res = await duploTesting
				.testRoute(GET("GET", "/product-sheet/1234"))
				.setDefaultFloorValue({ productSheet: productSheetData })
				.launch();
	
			expect(res.information).toBe("productSheet.found");
		});
	});
});
