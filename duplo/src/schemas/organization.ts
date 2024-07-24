import { organization_role } from "@prisma/client";

export const organizationSchema = zod.object({
	id: zod.string(),
	name: zod.string(),
	label: zod.string().nullable(),
	ownerId: zod.string(),
	suspended: zod.boolean(),
	logoKey: zod.string().nullable(),
	logoUrl: zod.string().nullable(),
	emailSupport: zod.string().nullable(),
});

export const organizationRolesTuple: TuplifyUnion<organization_role> = [
	"STORE_KEEPER",
	"PRODUCT_SHEET_MANAGER",
	"ACCOUNTANT",
	"OWNER",
];

export const organizationRolesEnum: UninonToEnum<organization_role> = {
	STORE_KEEPER: "STORE_KEEPER",
	PRODUCT_SHEET_MANAGER: "PRODUCT_SHEET_MANAGER",
	ACCOUNTANT: "ACCOUNTANT",
	OWNER: "OWNER",
};

export const organizationUserSchema = zod.object({
	id: zod.string(),
	email: zod.string(),
	lastname: zod.string(),
	firstname: zod.string(),
	organizationRole: zod.enum(organizationRolesTuple),
});
