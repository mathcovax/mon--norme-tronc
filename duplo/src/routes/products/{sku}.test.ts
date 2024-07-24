import { MockPrisma } from "@test/mocks/providers";
import { PATCH } from "./{sku}";
import { duploTesting } from "@test/setup";
import { productData, productEntityData } from "@test/data/product";

vi.mock(
	"@utils/prisma/product", 
	() => ({ productEntityformater: () => productData, productSelect: {} })
);

describe("PATCH /products/{sku}", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("update product", async () => {
		const spy = vi.fn(async () => undefined);
		MockPrisma.set("product", "update", spy);
	
		const res = await duploTesting
			.testRoute(PATCH("PATCH", "/product-sheet/1234"))
			.setDefaultFloorValue({ product: productEntityData })
			.setRequestProperties({
				body: {
					status: "WRONG",
				}
			})
			.launch();
			
		expect(res.information).toBe("product.edited");
		expect(spy).lastCalledWith({
			where: {
				sku: "la grosse tete de liam euhh enfaite non xD"
			},
			data: {
				status: "WRONG",
			},
			select: {}
		});
	});
});
