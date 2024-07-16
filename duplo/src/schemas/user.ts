import { primordial_role } from "@prisma/client";

export const primordialRolesTuple: TuplifyUnion<primordial_role> = [
	"CUSTOMER", "MODERATOR", "CONTENTS_MASTER", "ADMIN"
];

export const primordialRolesEnum: UninonToEnum<primordial_role> = {
	CUSTOMER: "CUSTOMER",
	MODERATOR: "MODERATOR",
	CONTENTS_MASTER: "CONTENTS_MASTER",
	ADMIN: "ADMIN",
};

export const userSchema = zod.object({
	id: zod.string(),
	email: zod.string(),
	lastname: zod.string(),
	firstname: zod.string(),
	dateOfBirth: zod.coerce.string(),
	address: zod.string(),
	primordialRole: zod.enum(primordialRolesTuple),
	muted: zod.boolean(),
	emailNotifcationsNewsletter: zod.boolean(),
	emailNotifcationsProductStock: zod.boolean(),
	emailNotifcationsPromotion: zod.boolean(),
	emailNotifcationsNewProductInCategory: zod.boolean(),
});

export const selfUserSchema = userSchema.extend({
	hasOrganization: zod.boolean(),
});
