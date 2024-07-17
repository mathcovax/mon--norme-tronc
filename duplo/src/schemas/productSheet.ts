import { product_sheet_status } from "@prisma/client";

export const productSheetStatusTuple: TuplifyUnion<product_sheet_status> = [
	"VERIFIED",
	"UNVERIFIED",
	"REMOVE",
]; 

export const productSheetSchema = zod.object({
	id: zod.string(),
	ref: zod.string(),
	name: zod.string(),
	description: zod.string(),
	shortDescription: zod.string(),
	price: zod.number(),
	createdAt: zod.coerce.string(),
	updatedAt: zod.coerce.string(),
	organizationId: zod.string(),
	warehouseId: zod.string(),
});
