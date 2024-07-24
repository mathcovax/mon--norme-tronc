import { duploTesting } from "@test/setup";
import { GET, POST } from ".";
import { productSheetData } from "@test/data/productSheet";
import { MockPrisma } from "@test/mocks/providers";
import { MockEnv } from "@test/mocks/env";
import { Process } from "@duplojs/duplojs";
import { S3Service } from "@services/S3";
import { imageProductSheetData } from "@test/data/imagesProductSheet";
import { uuidv7 } from "uuidv7";

vi.mock("@services/S3");
vi.mock("uuidv7");

describe("POST /product-sheets/{productSheetId}/images", () => {
	beforeEach(() => {
		MockPrisma.reset();
		MockEnv.reset();
		//@ts-expect-error var 'global' cause type error.
		global.multipart = () => [new Process("test", []), { pickup: ["multipartGetFile"] }];
	});

	it("productSheet image limit", async () => {
		const spy = vi.fn(async () => 6);
		MockPrisma.set("image_product_sheet", "count", spy);

		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setDefaultFloorValue({
				productSheet: productSheetData
			})
			.launch();

		expect(res.information).toBe("product.images.limit");
		expect(spy).lastCalledWith({
			where: {
				productSheetId: ""
			}
		});
	});

	it("missing image", async () => {
		MockPrisma.set("image_product_sheet", "count", async () => 1);

		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setDefaultFloorValue({
				productSheet: productSheetData
			})
			.mockProcess(1, { multipartGetFile: { image: [] } })
			.launch();
			
		expect(res.information).toBe("productSheet.image.missing");
	});

	it("post image", async () => {
		MockPrisma.set("image_product_sheet", "count", async () => 1);
		MockEnv.set("MINIO_BUCKET_PRODUCT_SHEET_IMAGES", "lolo");
		MockEnv.set("MINIO_PREFIX", "titi");
		const spy = vi.fn(async () => imageProductSheetData);
		MockPrisma.set("image_product_sheet", "create", spy);
		const spy1 = vi.spyOn(S3Service, "post").mockResolvedValue({ $metadata: {} });
		vi.mocked(uuidv7).mockReturnValue("toto");

		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setDefaultFloorValue({
				productSheet: productSheetData
			})
			.mockProcess(1, { multipartGetFile: { image: [{ properties: { filename: "toto.png" }, tempFileName: "ii" }] } })
			.launch();
			
		expect(res.information).toBe("productSheet.image.create");
		expect(spy1).lastCalledWith("lolo", "///toto.png", "ii");
		expect(spy).lastCalledWith({
			data: {
				id: "toto",
				key: "///toto.png",
				url: "/titi/lolo///toto.png",
				organizationId: "",
				productSheetId: "",
			}
		});
	});
});

describe("get /product-sheets/{productSheetId}/images", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});
	
	it("productSheet images", async () => {
		const spy = vi.fn(async () => [imageProductSheetData]);
		MockPrisma.set("image_product_sheet", "findMany", spy);

		const res = await duploTesting
			.testRoute(GET("GET", ""))
			.setDefaultFloorValue({
				productSheet: productSheetData
			})
			.launch();

		expect(res.information).toBe("productSheet.images");
		expect(spy).lastCalledWith({
			take: 6,
			where: {
				productSheetId: ""
			}
		});
	});
});
