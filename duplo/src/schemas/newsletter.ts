export const newsletterSchema = zod.object({
	id: zod.string(),
	object: zod.string(),
	content: zod.string(),
	createdAt: zod.coerce.date(),
	sendAt: zod.coerce.date(),
});
