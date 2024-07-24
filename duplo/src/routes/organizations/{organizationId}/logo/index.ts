import { organizationSchema } from "@schemas/organization";
import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";
import { S3Service } from "@services/S3";
import { extname } from "path";

/* METHOD : PUT, PATH : /organizations/{organizationId}/logo */
export const PUT = (method: Methods, path: string) =>
	hasOrganizationRoleByOrganizationId({ 
		options: { organizationRole: "OWNER" }, 
		pickup: ["organization"] 
	})
		.declareRoute(method, path)
		.process(
			...multipart({
				maxSize: 5000000,
				files: {
					logo: {
						max: 1,
						mimeType: ["image/jpeg", "image/png"]
					}
				}
			})
		)
		.cut(
			({ pickup }) => {
				const { logo } = pickup("multipartGetFile");
				const organizationLogo = logo[0];

				if (!organizationLogo) {
					throw new BadRequestHttpException("organization.logo.missing");
				}

				return {
					organizationLogo
				};
			},
			["organizationLogo"],
			new IHaveSentThis(BadRequestHttpException.code, "organization.logo.missing")
		)
		.handler(
			async ({ pickup }) => {
				const { id: organizationId } = pickup("organization");
				const organizationLogo = pickup("organizationLogo");
				const logoKey = `/${organizationId}/logo${extname(organizationLogo.properties.filename)}`;
				
				await S3Service.post(
					ENV.MINIO_BUCKET_ORGANIZATION_LOGO,
					logoKey,
					organizationLogo.tempFileName
				);

				const organization = await prisma.organization.update({
					where: {
						id: organizationId
					},
					data: {
						logoKey: logoKey,
						logoUrl: `/${ENV.MINIO_PREFIX}/${ENV.MINIO_BUCKET_ORGANIZATION_LOGO}${logoKey}`
					}
				});

				throw new CreatedHttpException("organization.logo.edited", organization);
			},
			new IHaveSentThis(CreatedHttpException.code, "organization.logo.edited", organizationSchema)
		);
