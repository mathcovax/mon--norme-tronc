import { accessTokenCheck, firebaseTokenCheck } from "./token";
import { MockFirebaseAuth } from "@test/mocks/providers";
import { AccessToken } from "@services/token";

vi.mock("@services/token");

describe("token service", () => {
	it("valide firebase token", async () => {
		MockFirebaseAuth.set("verifyIdToken", () => ({email: "eee"}));

		const result = await duplo.testChecker(firebaseTokenCheck, "");

		expect(result.info).toBe("firebase.token.valide");
	});

	it("invalide firebase token", async () => {
		MockFirebaseAuth.set("verifyIdToken", () => ({}) as never);

		const result = await duplo.testChecker(firebaseTokenCheck, "");

		expect(result.info).toBe("firebase.token.invalide");
	});

	it("valide accesToken", async () => {
		vi.mocked(AccessToken.check).mockReturnValue({} as never);

		const result = await duplo.testChecker(accessTokenCheck, "");

		expect(result.info).toBe("access.token.valide");
	});

	it("invalide accessToken", async () => {
		vi.mocked(AccessToken.check).mockReturnValue(null);

		const result = await duplo.testChecker(accessTokenCheck, "");

		expect(result.info).toBe("access.token.invalide");
	});
});
