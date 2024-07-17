export const productStockSchema = zod.object({
	productSheetId: zod.string(),
	quantity: zod.number(),
	date: zod.coerce.date(),
});
