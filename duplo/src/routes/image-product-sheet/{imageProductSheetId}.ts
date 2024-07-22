import { imageProductSheetExist } from "@checkers/imageProductSheet";
import { hasOrganizationRole } from "@security/hasOrganizationRole";
import { mustBeConnected } from "@security/mustBeConnected";
import { S3Service } from "@services/S3";

/* METHOD : DELETE, PATH : /image-product-sheet/{imageProductSheetId} */
export const DELETE = (method: Methods, path: string) => 
	mustBeConnected({ pickup: ["user"] })
		.declareRoute(method, path)
		.extract({
			params: {
				imageProductSheetId: zod.string()
			}
		})
		.check(
			imageProductSheetExist,
			{
				input: p => p("imageProductSheetId"),
				...imageProductSheetExist.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "imageProductSheet.notfound")
		)
		.process(
			hasOrganizationRole,
			{
				input: p => ({ 
					organizationId: p("imageProductSheet").organizationId, 
					userId: p("user").id 
				}),
				options: { organizationRole: "PRODUCT_SHEET_MANAGER" }
			}
		)
		.handler(
			async ({ pickup }) => {
				const { id: imageProductSheetId, key: imageProductSheetKey } = pickup("imageProductSheet");

				await S3Service.delete(
					ENV.MINIO_BUCKET_PRODUCT_SHEET_IMAGES,
					imageProductSheetKey
				);

				await prisma.image_product_sheet.delete({
					where: {
						id: imageProductSheetId
					}
				});

				throw new NoContentHttpException("imageProductSheet.deleted");
			},
			new IHaveSentThis(NoContentHttpException.code, "imageProductSheet.deleted")
		);
