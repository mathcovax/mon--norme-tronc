import jwt from "jsonwebtoken";

export interface AccessTokenContent {
	id: string
	lastUpdateUser: number
}

export class AccessToken {
	static generate(content: AccessTokenContent) {
		const tokenContent = { content };

		return jwt.sign(
			tokenContent,
			ENV.JWT_KEY,
			{ expiresIn: ENV.JWT_TIME }
		);
	}

	static check(token: string) {
		try {
			const { content } = jwt.verify(
				token,
				ENV.JWT_KEY,
			) as jwt.JwtPayload;

			if (!content) {
				throw new Error("Missing content AccessToken");
			}

			return content as AccessTokenContent;
		} catch {
			return null;
		}
	}
}
