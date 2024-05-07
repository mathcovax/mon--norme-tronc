import { AccessToken } from "@services/token";

export const firebaseTokenCheck = duplo
	.createChecker("firebaseToken")
	.handler(async (token: string, output) => {
		try {
			const decodedIdToken = await firebaseAuth.verifyIdToken(token);

			const { email } = decodedIdToken;

			if (!email) {
				throw new Error("Missing Email");
			}

			return output("firebase.token.valid", { ...decodedIdToken, email });
		} catch {
			return output("firebase.token.invalid", null);
		}
	})
	.build();

export const accessTokenCheck = duplo
	.createChecker("accessToken")
	.handler((token: string, output) => {
		const accessTokenContent = AccessToken.check(token);

		if (accessTokenContent) {
			return output("access.token.valid", accessTokenContent);
		}
		else {
			return output("access.token.invalid", null);
		}
	})
	.build();
