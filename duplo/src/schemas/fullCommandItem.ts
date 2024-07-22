import { facet_type } from "@prisma/client";

export const fullCommandItemSchema = zod.object({
	id: zod.number(),
	commandId: zod.string(),
	productQuantity: zod.number(),
	dayOfYear: zod.coerce.date(),
	totalValue: zod.number(),
	organization: zod.object({
		id: zod.string(),
		name: zod.string(),
	}),
	productSheet: zod.object({
		id: zod.string(),
		name: zod.string(),
		ref: zod.string(),
		price: zod.number(),
		categories: zod.string().array(),
		imageUrl: zod.string(),
		facets: zod.object<{ [P in facet_type]: Zod.ZodOptional<Zod.ZodString> }>({
			ACCESSORY: zod.string().optional(),
			COLOR: zod.string().optional(),
			DIAMETER: zod.string().optional(),
			MATERIAL: zod.string().optional(),
			SIZE: zod.string().optional(),
			STIMULATION: zod.string().optional(),
			TARGET: zod.string().optional(),
		}),
	}),	
});

export type FullCommandItemSchema = Zod.infer<typeof fullCommandItemSchema>;
