import { MockPrisma } from "@test/mocks/providers";
import { duploTesting } from "@test/setup";
import { POST } from ".";
import { newsletterData } from "@test/data/newsletter";

describe("POST /newsletter", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("post newsletter", async () => {
		const spy = vi.fn(() => newsletterData);
		MockPrisma.set("newsletter", "create", spy);

		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setRequestProperties({
				body: {
					object: "Test",
					content: "This is a test.",
					sendAt: new Date()
				}
			})
			.launch();

		expect(res.information).toBe("newsletter.created");
		expect(spy).lastCalledWith({
			data: {
				object: "Test",
				content: "This is a test.",
				sendAt: expect.any(Date)
			}
		});
	});
});
