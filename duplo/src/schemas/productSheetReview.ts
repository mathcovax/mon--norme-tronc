export const productSheetReviewSchema = zod.object({
	_id: zod.string(),
	userId: zod.string(),
	productSheetId: zod.string(),
	pseudo: zod.string(),
	content: zod.string().optional(),
	createdAt: zod.date(),
	rate: zod.number(),
	check: zod.boolean(),
});
