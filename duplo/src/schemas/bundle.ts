export const bundleProductSchema = zod.object({
	name: zod.string(),
	productSheetId: zod.string(),
	imageUrl: zod.string(),
	quantity: zod.number(),
});

export const bundleSchema = zod.object({
	idShip: zod.string(),
	bundleProducts: bundleProductSchema.array()
});

export type BundleSchema = Zod.infer<typeof bundleSchema>
