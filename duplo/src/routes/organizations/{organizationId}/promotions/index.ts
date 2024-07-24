import { promotionSchema } from "@schemas/promotion";
import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";
import { promotionEntityformater, promotionInclude } from "@utils/prisma/promotion";

/* METHOD : GET, PATH : /organizations/{organizationId}/promotions */
export const GET = (method: Methods, path: string) => 
	hasOrganizationRoleByOrganizationId({ options: { organizationRole: "PRODUCT_SHEET_MANAGER" }, pickup: ["organization"] })
		.declareRoute(method, path)
		.extract({
			query: {
				page: zod.coerce.number().default(0),
			}
		})
		.handler(
			async ({ pickup }) => {
				const { id: organizationId } = pickup("organization");
				const page = pickup("page");

				const promotions = await prisma.promotion.findMany({
					where: {
						organizationId: organizationId
					},
					include: promotionInclude,
					take: 10,
					skip: page * 10
				}).then(
					promotionEntitys => promotionEntitys.map(promotionEntityformater)
				);

				throw new OkHttpException("organization.promotions", promotions);
			}, 
			new IHaveSentThis(OkHttpException.code, "organization.promotions", promotionSchema.array())
		)
;
