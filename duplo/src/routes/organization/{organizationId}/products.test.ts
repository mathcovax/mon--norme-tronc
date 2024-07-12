import { MockPrisma } from "@test/mocks/providers";
import { duploTesting } from "@test/setup";
import { GET } from "./products";
import { organizationData } from "@test/data/organization";
import { productData } from "@test/data/product";

vi.mock(
	"@utils/prisma/product", 
	() => ({ productEntityformater: () => productData, productSelect: {} })
);

describe("GET /organization/{organizationId}/products", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("get products", async () => {
		const spy = vi.fn(async () => []);
		MockPrisma.set("product", "findMany", spy);

		const res = await duploTesting
			.testRoute(GET("GET", ""))
			.setDefaultFloorValue({ organization: organizationData })
			.setRequestProperties({
				query: {
					sku: "eeee",
					withProductSheet: "true",
					withWarehouse: "false"
				}
			})
			.launch();

		expect(spy).lastCalledWith({
			where: {
				organizationId: "eee",
				productSheetId: undefined,
				status: undefined,
				sku: {
					contains: "eeee",
					mode: "insensitive",
				}
			},
			skip: 0,
			take: 10,
			select: {},
			orderBy: {
				createdAt: "desc"
			}
		});
		expect(res.information).toBe("products.found");
	});
});
