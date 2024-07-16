export const promotionSchema = zod.object({
	id: zod.number(),
	percentage: zod.number(),
	startDate: zod.coerce.string(),
	endDate: zod.coerce.string(),
	productSheetName: zod.string(),
	productSheetId: zod.string(),
	reason: zod.string(),
});

export type PromotionSchema = Zod.infer<typeof promotionSchema>
