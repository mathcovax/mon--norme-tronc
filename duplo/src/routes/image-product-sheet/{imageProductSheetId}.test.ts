import { duploTesting } from "@test/setup";
import { DELETE } from "./{imageProductSheetId}";
import { imageProductSheetData } from "@test/data/imagesProductSheet";
import { MockPrisma } from "@test/mocks/providers";
import { S3Service } from "@services/S3";
import { MockEnv } from "@test/mocks/env";

vi.mock("@services/S3");

describe("DELETE /image-product-sheet/{imageProductSheetId}", () => {
	beforeEach(() => {
		MockPrisma.reset();
		MockEnv.reset();
	});

	it("imageProductSheet not found", async () => {
		const res = await duploTesting
			.testRoute(DELETE("DELETE", ""))
			.setRequestProperties({
				params: {
					imageProductSheetId: "eeee"
				}
			})
			.mockChecker(0, { info: "imageProductSheet.notfound", data: null })
			.launch();

		expect(res.information).toBe("imageProductSheet.notfound");
	});

	it("delete imageProductSheet", async () => {
		MockEnv.set("MINIO_BUCKET_PRODUCT_SHEET_IMAGES", "lolo");
		const spy = vi.fn(async () => null);
		MockPrisma.set("image_product_sheet", "delete", spy);
		const spy1 = vi.spyOn(S3Service, "delete").mockResolvedValue({ $metadata: {} });

		const res = await duploTesting
			.testRoute(DELETE("DELETE", ""))
			.setDefaultFloorValue({ user: {} })
			.setRequestProperties({
				params: {
					imageProductSheetId: "eeee"
				}
			})
			.mockChecker(0, { info: "imageProductSheet.exist", data: imageProductSheetData })
			.mockProcess(1, {})
			.launch();

		expect(res.information).toBe("imageProductSheet.deleted");
		expect(spy1).lastCalledWith("lolo", "zz");
		expect(spy).lastCalledWith({
			where: {
				id: "puteeee"
			}
		});
	});
});
