import { command_status } from "@prisma/client";

export const commandStatusTuple: TuplifyUnion<command_status> = [
	"CANCELED",
	"WAITING_PAYMENT",
	"IN_PROGRESS",
	"IN_DELIVERY",
	"DONE"
];

export const fullCommandSchema = zod.object({
	id: zod.string(),
	firstname: zod.string(),
	lastname: zod.string(),
	status: zod.enum(commandStatusTuple),
	userId: zod.string(),
	deliveryAddress: zod.string(),
	createdDate: zod.coerce.date(),
	price: zod.number(),
	items: zod.object({
		quantity: zod.number(),
		productSheetId: zod.string(),
		productSheetName: zod.string(),
		productSheetFirstImageUrl: zod.string(),
		productSheetOrganizationName: zod.string(),
		productSheetPrice: zod.number()
	}).array()
});

export type FullCommandSchema = Zod.infer<typeof fullCommandSchema>;
