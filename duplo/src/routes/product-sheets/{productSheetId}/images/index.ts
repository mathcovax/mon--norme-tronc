import { imageProductSheetSchema } from "@schemas/imagesProductSheet";
import { hasOrganizationRoleByProductSheetId } from "@security/hasOrganizationRole/byProductSheetId";
import { S3Service } from "@services/S3";
import { extname } from "path";
import { uuidv7 } from "uuidv7";

/* METHOD : POST, PATH : /product-sheets/{productSheetId}/images */
export const POST = (method: Methods, path: string) =>
	hasOrganizationRoleByProductSheetId({ pickup: ["productSheet"] })
		.declareRoute(method, path)
		.cut(
			async ({ pickup }) => {
				const { id: productSheetId } = pickup("productSheet");

				const imageProductSheetCount = await prisma.image_product_sheet.count({
					where: {
						productSheetId
					}
				});

				if (imageProductSheetCount >= MetConfig.productSheet.imagesLimit) {
					throw new ConflictHttpException("product.images.limit");
				}

				return {};
			},
			[],
			new IHaveSentThis(ConflictHttpException.code, "product.images.limit")
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
				const productSheetImage = image[0];

				if (!productSheetImage) {
					throw new BadRequestHttpException("productSheet.image.missing");
				}

				return {
					productSheetImage
				};
			},
			["productSheetImage"],
			new IHaveSentThis(BadRequestHttpException.code, "productSheet.image.missing")
		)
		.handler(
			async ({ pickup }) => {
				const { id: productSheetId, organizationId } = pickup("productSheet");
				const productSheetImage = pickup("productSheetImage");
				const imageId = uuidv7();
				const imageKey = `/${organizationId}/${productSheetId}/${imageId}${extname(productSheetImage.properties.filename)}`;

				await S3Service.post(
					ENV.MINIO_BUCKET_PRODUCT_SHEET_IMAGES,
					imageKey, 
					productSheetImage.tempFileName
				);
				
				const imageProductSheet = await prisma.image_product_sheet.create({
					data: {
						id: imageId,
						url: `/${ENV.MINIO_PREFIX}/${ENV.MINIO_BUCKET_PRODUCT_SHEET_IMAGES}${imageKey}`,
						key: imageKey,
						organizationId,
						productSheetId,
					}
				});

				throw new CreatedHttpException("productSheet.image.create", imageProductSheet);
			},
			new IHaveSentThis(CreatedHttpException.code, "productSheet.image.create", imageProductSheetSchema)
		);

/* METHOD : GET, PATH : /product-sheets/{productSheetId}/images */
export const GET = (method: Methods, path: string) => 
	hasOrganizationRoleByProductSheetId({ pickup: ["productSheet"] })
		.declareRoute(method, path)
		.handler(
			async ({ pickup }) => {
				const { id: productSheetId } = pickup("productSheet");

				const imagesProductSheet = await prisma.image_product_sheet.findMany({
					where: {
						productSheetId
					},
					take: 6
				});

				throw new OkHttpException("productSheet.images", imagesProductSheet);
			},
			new IHaveSentThis(OkHttpException.code, "productSheet.images", imageProductSheetSchema.array())
		);
