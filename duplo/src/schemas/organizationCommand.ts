export const organizationCommandCollectionSchema = zod.object({
	commandId: zod.string(),
	quantity: zod.number(),
	createdAt: zod.coerce.string(),
}).array();

export const organizationCommandDetailesSchema = zod.object({
	commandItemId: zod.number(),
	commandId: zod.string(),
	quantity: zod.number(),
	processQuantity: zod.number(),
	productSheetName: zod.string(),
	productSheetId: zod.string(),
	productSheetFirstImageUrl: zod.string(),
}).array();
