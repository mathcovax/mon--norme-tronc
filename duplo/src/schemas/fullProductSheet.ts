import { facet_type } from "@prisma/client";
import { productSheetStatusTuple } from "./productSheet";

export const facetsSchema = zod.object<{ [P in facet_type]: Zod.ZodOptional<Zod.ZodString> }>({
	ACCESSORY: zod.string().optional(),
	COLOR: zod.string().optional(),
	DIAMETER: zod.string().optional(),
	MATERIAL: zod.string().optional(),
	SIZE: zod.string().optional(),
	STIMULATION: zod.string().optional(),
	TARGET: zod.string().optional(),
});

export const fullProductSheetSchema = zod.object({
	id: zod.string(),
	ref: zod.string(),
	name: zod.string(),
	price: zod.number(),
	shortDescription: zod.string(),
	description: zod.string(),
	quantity: zod.number(),
	categories: zod.string().array(),
	images: zod.string().array(),
	hasPromotion: zod.boolean().optional(),
	avgRate: zod.string(),
	countRate: zod.number(),
	status: zod.enum(productSheetStatusTuple),
	promotion: zod.object({
		id: zod.number(),
		originalPrice: zod.number(),
		percentage: zod.number(),
		startDate: zod.coerce.date(),
		endDate: zod.coerce.date(),
		reason: zod.string(),
	}).optional(),
	organization: zod.object({
		id: zod.string(),
		name: zod.string(),
		label: zod.string().optional(),
		logoUrl: zod.string().optional(),
	}),
	facets: facetsSchema,
	variationGroup: zod.string().optional(),
	variationName: zod.string().optional(),
	variations: zod.object({
		firstImageUrl: zod.string(),
		name: zod.string(),
		productSheetId: zod.string(),
	}).array().optional(),
});

export type FullProductSheetSchema = Zod.infer<typeof fullProductSheetSchema>
