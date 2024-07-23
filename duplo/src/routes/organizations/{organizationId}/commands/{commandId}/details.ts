import { commandExistCheck } from "@checkers/command";
import { organizationCommandDetailesSchema } from "@schemas/organizationCommand";
import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";

/* METHOD : GET, PATH : /organizations/{organizationId}/commands/{commandId}/details */
export const GET = (method: Methods, path: string) => 
	hasOrganizationRoleByOrganizationId({ options: { organizationRole: "STORE_KEEPER" }, pickup: ["organization"] })
		.declareRoute(method, path)
		.extract({
			params: {
				commandId: zod.string()
			}
		})
		.check(
			commandExistCheck,
			{
				input: p => p("commandId"),
				...commandExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "command.notfound")
		)
		.cut(
			async ({ pickup }) => {
				const commandId = pickup("commandId");
				const { id: organizationId } = pickup("organization");

				const commandDetails = await prisma.$queryRaw`
					SELECT
						ci.id AS "commandItemId",
						ci."commandId" AS "commandId",
						ci.quantity AS quantity,
						ci."processQuantity" AS "processQuantity",
						ps.name AS "productSheetName",
						ps.id AS "productSheetId",
						ps.ref as "productSheetRef",
						(SELECT ips.url AS url FROM image_product_sheet AS ips WHERE ips."productSheetId" = ps.id LIMIT 1) AS "productSheetFirstImageUrl"
					FROM command_item AS ci
					INNER JOIN product_sheet AS ps ON ps.id = ci."productSheetId"
					WHERE 
						ps."organizationId" = ${organizationId}
						AND ci."commandId" = ${commandId}
						AND ci.quantity != ci."processQuantity"
				` as Zod.infer<typeof organizationCommandDetailesSchema>;

				if (commandDetails.length === 0) {
					throw new NotFoundHttpException("commandItem.missing");
				}

				return {
					commandDetails
				};
			},
			["commandDetails"],
			new IHaveSentThis(NotFoundHttpException.code, "commandItem.missing")
		)
		.handler(
			async ({ pickup }) => {
				const commandDetails = pickup("commandDetails");

				throw new OkHttpException("organizationCommandDetailes", commandDetails);
			},
			new IHaveSentThis(OkHttpException.code, "organizationCommandDetailes", organizationCommandDetailesSchema)
		);
