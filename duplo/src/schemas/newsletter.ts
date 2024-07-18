export const newsletterSchema = zod.object({
	id: zod.string(),
	title: zod.string(),
	content: zod.string(),
	createdAt: zod.coerce.date(),
});
