import { MockPrisma } from "@test/mocks/providers";
import { POST } from ".";
import { duploTesting } from "@test/setup";

describe("POST /login", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("user login", async () => {
		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setRequestProperties({ body: "test" })
			.mockChecker(
				"firebaseToken",
				{ info: "firebase.token.valid", data: { email: "test" } },
				{ passCatch: true }
			)
			.mockChecker(
				"userExist",
				{ info: "user.exist", data: { updatedAt: new Date, id: "1234" } },
				{ passCatch: true }
			)
			.launch();
			
		expect(res.information).toBe("user.logged");
	});

	it("user register", async () => {
		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setRequestProperties({ body: "test" })
			.mockChecker(
				"firebaseToken",
				{ info: "firebase.token.valid", data: { email: "test" } }
			)
			.mockChecker(
				"userExist",
				{ info: "", data: null }
			)
			.launch();

		expect(res.information).toBe("user.notfound");
	});
});
