import { promotionExistCheck } from "@checkers/promotion";
import { hasOrganizationRole } from "@security/hasOrganizationRole";
import { mustBeConnected } from "@security/mustBeConnected";

/* METHOD : DELETE, PATH : /promotions/{promotionId} */
export const DELETE = (method: Methods, path: string) => 
	mustBeConnected({ pickup: ["user"] })
		.declareRoute(method, path)
		.extract({
			params: {
				promotionId: zod.coerce.number(),
			},
		})
		.check(
			promotionExistCheck,
			{
				input: p => p("promotionId"),
				...promotionExistCheck.preCompletions.mustExist,
			},
			new IHaveSentThis(NotFoundHttpException.code, "promotion.notfound")
		)
		.process(
			hasOrganizationRole,
			{
				input: p => ({ 
					organizationId: p("promotion").organizationId, 
					userId: p("user").id 
				}),
				options: { organizationRole: "PRODUCT_SHEET_MANAGER" }
			}
		)
		.handler(
			async ({ pickup }) => {
				const promotionId = pickup("promotionId");

				prisma.promotion.delete({
					where: {
						id: promotionId
					}
				});

				throw new NoContentHttpException("promotion.deleted");
			},
			new IHaveSentThis(NoContentHttpException.code, "promotion.deleted")
		);
