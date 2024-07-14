import { product_return_status } from "@prisma/client";

export const productReturnStatusTuple: TuplifyUnion<product_return_status> = [
	"WAITING_RETURN",
	"REFUNDED",
	"INVALID",
];

export const productReturnStatusEnum: UninonToEnum<product_return_status> = {
	INVALID: "INVALID",
	WAITING_RETURN: "WAITING_RETURN",
	REFUNDED: "REFUNDED",
};

export const productReturnSchema = zod.object({
	id: zod.number(),
	productSku: zod.string(),
	reason: zod.string(),
	status: zod.enum(productReturnStatusTuple),
	organizationId: zod.string(),
	createdAt: zod.coerce.string(),
});
