import { MockPrisma } from "@test/mocks/providers";
import { POST } from ".";
import { duploTesting } from "@test/setup";
import { productSheetData } from "@test/data/productSheet";
import { productData } from "@test/data/product";
import { warehouseData } from "@test/data/warehouse";

vi.mock(
	"@utils/prisma/product", 
	() => ({ productEntityformater: () => productData, productSelect: {} })
);

describe("POST /product-sheets/{productSheetId}/products", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("sku already use", async () => {
		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setDefaultFloorValue({ productSheet: productSheetData })
			.setRequestProperties({
				body: {
					sku: "test",
					warehouseId: "test",
				}
			})
			.mockChecker(
				0,
				{ info: "product.exist", data: warehouseData }
			)
			.launch();

		expect(res.information).toBe("product.sku.alreadyUse");
	});

	it("post product sheet created", async () => {
		const spy = vi.fn(async () => productData);
		MockPrisma.set("product", "create", spy);

		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setDefaultFloorValue({ productSheet: productSheetData })
			.setRequestProperties({
				body: {
					sku: "test",
					warehouseId: "test",
				}
			})
			.mockChecker(
				0,
				{ info: "product.notfound", data: null }
			)
			.launch();
		
		expect(spy).lastCalledWith({
			data: {
				sku: "test",
				productSheetId: "",
				organizationId: "",
			},
			select: {}
		});
		expect(res.information).toBe("product.created");
	});
});
