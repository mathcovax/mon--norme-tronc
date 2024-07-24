import type { category } from "@prisma/client";
import { prisma } from "../prismaClient";
import { faker } from "@faker-js/faker";
import { uuidv7 } from "uuidv7";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import * as env from "../../env";

const S3 = new S3Client({
	region: "local",
	forcePathStyle: true,
	endpoint: env.default.MINIO_URL,
	credentials: {
		accessKeyId: env.default.MINIO_ROOT_USER,
		secretAccessKey: env.default.MINIO_ROOT_PASSWORD,
	}
});

export const makeCategory = async (
	imageBuffer: Buffer,
	category?: Partial<category>
) => {
	const imageId = uuidv7();
	const imageKey = `/${imageId}category${Date.now()}.jpg`;
	
	S3.send(
		new PutObjectCommand({
			Bucket: env.default.MINIO_BUCKET_CONTENT,
			Key: imageKey,
			Body: imageBuffer,
		})
	);

	return await prisma.category.create({
		data: {
			name: category?.name || faker.commerce.department() + Math.floor(Math.random() * 1000),
			disabled: category?.disabled || false,
			imageKey,
			imageUrl: `/${ENV.MINIO_PREFIX}/${env.default.MINIO_BUCKET_CONTENT}${imageKey}`,
		}
	});
};

export const categoryExist = (
	name: string
) => 
	prisma.category.findFirst({
		where: {
			name,
		}
	});

export const addProductSheetToCategory = (productSheetId: string, categoryName: string) =>
	prisma.product_sheet_to_category.create({
		data: {
			categoryName,
			productSheetId
		}
	});
