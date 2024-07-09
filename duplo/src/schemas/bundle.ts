import { bundle_status, carrier_name } from "@prisma/client";

export const carrierNameBundleTuple: TuplifyUnion<carrier_name> = ["LA_POSTE"];

export const bundleStatusTuple: TuplifyUnion<bundle_status> = [
	"CREATED", 
	"CARRIER_SUPPORTED",
	"CARRIER_PROCESS", 
	"UNDELIVERABLE", 
	"DONE", 
	"DONE_OFFICE", 
	"BACK",
	"BACK_DONE"
];

export const bundleProductSchema = zod.object({
	name: zod.string(),
	productSheetId: zod.string(),
	imageUrl: zod.string(),
	quantity: zod.number(),
});

export const bundleWithDetailsSchema = zod.object({
	id: zod.number(),
	idShip: zod.string(),
	carrierName: zod.enum(carrierNameBundleTuple),
	commandId: zod.string(),
	status: zod.enum(bundleStatusTuple),
	bundleProducts: bundleProductSchema.array()
});

export const bundleSchema = zod.object({
	id: zod.number(),
	idShip: zod.string(),
	carrierName: zod.enum(carrierNameBundleTuple),
	commandId: zod.string(),
	status: zod.enum(bundleStatusTuple),
	productCount: zod.number()
});

export type bundleWithDetailsSchema = Zod.infer<typeof bundleWithDetailsSchema>
