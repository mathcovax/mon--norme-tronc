import { facet_type } from "@prisma/client";

export const fullProductSheetSchema = zod.object({
	id: zod.string(),
	name: zod.string(),
	price: zod.number(),
	shortDescription: zod.string(),
	description: zod.string(),
	quantity: zod.number(),
	categories: zod.string().array(),
	images: zod.string().array(),
	hasPromotion: zod.boolean().optional(),
	promotion: zod.object({
		originalPrice: zod.number(),
		percentage: zod.number(),
		startDate: zod.date(),
		endDate: zod.date(),
	}).optional(),
	organization: zod.object({
		id: zod.string(),
		name: zod.string(),
		label: zod.string().optional(),
		logoUrl: zod.string().optional(),
	}),
	facets: zod.object<{ [P in facet_type]: Zod.ZodOptional<Zod.ZodString> }>({
		ACCESSORY: zod.string().optional(),
		COLOR: zod.string().optional(),
		DIAMETER: zod.string().optional(),
		MATERIAL: zod.string().optional(),
		SIZE: zod.string().optional(),
		STIMULATION: zod.string().optional(),
		TARGET: zod.string().optional(),
	}),
});

export type FullProductSheetSchema = Zod.infer<typeof fullProductSheetSchema>
