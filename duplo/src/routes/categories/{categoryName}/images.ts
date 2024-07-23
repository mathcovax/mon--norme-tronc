import { categoryExistCheck } from "@checkers/category";
import { categorySchema } from "@schemas/category";
import { hasPrimordialRole } from "@security/hasPrimordialRole";
import { S3Service } from "@services/S3";
import { extname } from "path";

/* METHOD : PUT, PATH : /categories/{categoryName}/images */
export const PUT = (method: Methods, path: string) => 
	hasPrimordialRole({ options: { primordialRole: "CONTENTS_MASTER" } })
		.declareRoute(method, path)
		.extract({
			params: {
				categoryName: zod.string()
			}
		})
		.check(
			categoryExistCheck,
			{
				input: p => p("categoryName"),
				...categoryExistCheck.preCompletions.mustExist,
			},
			new IHaveSentThis(NotFoundHttpException.code, "category.notfound")
		)
		.process(
			...multipart({
				files: {
					image: {
						max: 1,
						mimeType: ["image/jpeg", "image/png"]
					}
				}
			})
		)
		.cut(
			({ pickup }) => {
				const { image } = pickup("multipartGetFile");
				const categoryImage = image[0];

				if (!categoryImage) {
					throw new BadRequestHttpException("category.image.missing");
				}

				return {
					categoryImage
				};
			},
			["categoryImage"],
			new IHaveSentThis(BadRequestHttpException.code, "category.image.missing")
		)
		.handler(
			async ({ pickup }) => {
				const categoryImage = pickup("categoryImage");
				const { name: categorieName, imageKey: oldImageKey } = pickup("category");
				const newImageKey = `/category/${categorieName}/${Date.now()}${extname(categoryImage.properties.filename)}`;

				if (oldImageKey) {
					await S3Service.delete(ENV.MINIO_BUCKET_CONTENT, oldImageKey);
				}

				await S3Service.post(ENV.MINIO_BUCKET_CONTENT, newImageKey, categoryImage.tempFileName);

				const category = await prisma.category.update({
					where: {
						name: categorieName
					},
					data: {
						imageKey: newImageKey,
						imageUrl: `/${ENV.MINIO_PREFIX}/${ENV.MINIO_BUCKET_CONTENT}${newImageKey}`
					}
				});

				throw new CreatedHttpException("category.image.updated", category);
			},
			new IHaveSentThis(CreatedHttpException.code, "category.image.updated", categorySchema)
		);
