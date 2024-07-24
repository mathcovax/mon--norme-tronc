import { MockEnv } from "@test/mocks/env";
import { MockPrisma } from "@test/mocks/providers";
import { duploTesting } from "@test/setup";
import { PUT } from "./index";
import { organizationData } from "@test/data/organization";
import { Process } from "@duplojs/duplojs";
import { S3Service } from "@services/S3";

describe("PUT /organizations/{organizationId}/logo", () => {
	beforeEach(() => {
		MockPrisma.reset();
		MockEnv.reset();
		//@ts-expect-error var 'global' cause type error.
		global.multipart = () => [new Process("test", []), { pickup: ["multipartGetFile"] }];
	});
	
	it("missing logo", async () => {
		const res = await duploTesting
			.testRoute(PUT("PUT", ""))
			.setDefaultFloorValue({
				organization: organizationData
			})
			.mockProcess(0, { multipartGetFile: { logo: [] } })
			.launch();
		
		expect(res.information).toBe("organization.logo.missing");
	});

	it("put logo", async () => {
		MockEnv.set("MINIO_BUCKET_ORGANIZATION_LOGO", "lolo");
		MockEnv.set("MINIO_PREFIX", "titi");
		const spy = vi.fn(async () => organizationData);
		MockPrisma.set("organization", "update", spy);
		const spy2 = vi.spyOn(S3Service, "post").mockResolvedValue({ $metadata: {} });

		const res = await duploTesting
			.testRoute(PUT("PUT", ""))
			.setDefaultFloorValue({
				organization: organizationData
			})
			.mockProcess(0, { multipartGetFile: { logo: [{ properties: { filename: "toto.png" }, tempFileName: "ii" }] } })
			.launch();
			
		expect(res.information).toBe("organization.logo.edited");
		expect(spy2).lastCalledWith("lolo", "/eee/logo.png", "ii");
		expect(spy).lastCalledWith({
			where: {
				id: "eee"
			},
			data: {
				logoKey: "/eee/logo.png",
				logoUrl: "/titi/lolo/eee/logo.png"
			},
		});
	});
});
