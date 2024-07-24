import { duploTesting } from "@test/setup";
import { PUT } from "./image";
import { MockEnv } from "@test/mocks/env";
import { MockPrisma } from "@test/mocks/providers";
import { Process } from "@duplojs/duplojs";
import { categoryData } from "@test/data/category";
import { S3Service } from "@services/S3";

describe("PUT /categories/{categoryName}/image", () => {
	beforeEach(() => {
		MockPrisma.reset();
		MockEnv.reset();
		//@ts-expect-error var 'global' cause type error.
		global.multipart = () => [new Process("test", []), { pickup: ["multipartGetFile"] }];
	});

	it("category not found", async () => {
		const res = await duploTesting
			.testRoute(PUT("PUT", ""))
			.setRequestProperties({
				params: {
					categoryName: "toto"
				}
			})
			.mockChecker(0, { info: "category.notfound", data: null })
			.launch();

		expect(res.information).toBe("category.notfound");
	});

	it("missing image", async () => {
		const res = await duploTesting
			.testRoute(PUT("PUT", ""))
			.setRequestProperties({
				params: {
					categoryName: "toto"
				}
			})
			.mockChecker(0, { info: "category.exist", data: null })
			.mockProcess(1, { multipartGetFile: { image: [] } })
			.launch();

		expect(res.information).toBe("category.image.missing");
	});

	it("post image", async () => {
		const spy1 = vi.spyOn(S3Service, "post").mockResolvedValue({ $metadata: {} });
		const spy2 = vi.spyOn(S3Service, "delete").mockResolvedValue({ $metadata: {} });
		vi.spyOn(Date, "now").mockReturnValue(1);
		MockEnv.set("MINIO_BUCKET_CONTENT", "lolo");
		MockEnv.set("MINIO_PREFIX", "titi");
		const spy = vi.fn(async () => categoryData);
		MockPrisma.set("category", "update", spy);

		const res = await duploTesting
			.testRoute(PUT("PUT", ""))
			.setRequestProperties({
				params: {
					categoryName: "toto"
				}
			})
			.mockChecker(0, { info: "category.exist", data: categoryData })
			.mockProcess(1, { multipartGetFile: { image: [{ properties: { filename: "toto.png" }, tempFileName: "ii" }] } })
			.launch();

		expect(res.information).toBe("category.image.updated");
		expect(spy).lastCalledWith({
			data: {
				imageKey: "/category/super Cat/1.png",
				imageUrl: "/titi/lolo/category/super Cat/1.png"
			},
			where: {
				name: "super Cat"
			}
		});
		expect(spy1).lastCalledWith(
			"lolo",
			"/category/super Cat/1.png",
			"ii",
		);
		expect(spy2).lastCalledWith(
			"lolo",
			"/imageKey"
		);
	});
});
