import { promotionSchema } from "@schemas/promotion";
import { hasOrganizationRoleByProductSheetId } from "@security/hasOrganizationRole/byProductSheetId";
import { promotionEntityformater, promotionInclude } from "@utils/prisma/promotion";

/* METHOD : POST, PATH : /product-sheets/{productSheetId}/promotions */
export const POST = (method: Methods, path: string) => 
	hasOrganizationRoleByProductSheetId({ pickup: ["productSheet"]  })
		.declareRoute(method, path)
		.extract({
			body: zod.object({
				percentage: zod.number().min(1).max(100),
				startDate: zod.coerce.date(),
				endDate: zod.coerce.date(),
				reason: zod.string(),
			}).strip(),
		})
		.cut(
			({ pickup }) => {
				const { startDate, endDate } = pickup("body");

				if (startDate.getTime() >= endDate.getTime()) {
					throw new BadRequestHttpException("promotion.date.invalid");
				}

				return {};
			},
			[],
			new IHaveSentThis(BadRequestHttpException.code, "promotion.date.invalid")
		)
		.handler(
			async ({ pickup }) => {
				const { percentage, startDate, endDate, reason } = pickup("body");
				const { id: productSheetId, organizationId } = pickup("productSheet");

				const promotion = await prisma.promotion.create({
					data: {
						percentage,
						startDate,
						endDate,
						reason,
						organizationId: organizationId,
						productSheetId: productSheetId,
					},
					include: promotionInclude
				}).then(promotionEntityformater);

				throw new CreatedHttpException("promotion.created", promotion);
			},
			new IHaveSentThis(CreatedHttpException.code, "promotion.created", promotionSchema)
		);
