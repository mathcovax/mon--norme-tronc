import { config as importEnvFile } from "dotenv";
import { expand as expandEnv } from "dotenv-expand";
import { zod } from "@duplojs/duplojs";

declare global {
	const ENV: (typeof import("./env"))["default"];
}

for (const pathEnv of [".env.local", ".env"]) {
	expandEnv(
		importEnvFile({ path: pathEnv })
	);
}

//@ts-expect-error var 'global' cause type error.
export default global.ENV = zod
	.object({
		PORT: zod.coerce.number().default(1506),
		HOST: zod.string().default("0.0.0.0"),
		ENVIRONMENT: zod.enum(["DEV", "PROD", "TEST"]).default("DEV"),
		MONGO_DATABASE_URL: zod.string(),
		MINIO_URL: zod.string(),
		MINIO_ROOT_USER: zod.string(),
		MINIO_ROOT_PASSWORD: zod.string(),
		MINIO_PREFIX: zod.string(),
		MINIO_BUCKET_PRODUCT_SHEET_IMAGES: zod.string(),
		MINIO_BUCKET_CONTENT: zod.string(),
		MINIO_BUCKET_ORGANIZATION_LOGO: zod.string(),
		FIREBASE_CREDENTIAL_PATH: zod.string(),
		JWT_KEY: zod.string(),
		JWT_TIME: zod.string(),
		MAIL_FROM: zod.string(),
		STRIPE_API_KEY: zod.string(),
		STRIPE_API_WEBHOOK_SECRET: zod.string(),
		ORIGIN: zod.string().url(),
		LA_POSTE_KEY: zod.string(),
		BREVO_KEY: zod.string(),
		BREVO_USER: zod.string(),
	})
	.readonly()
	.parse(process.env);

	
