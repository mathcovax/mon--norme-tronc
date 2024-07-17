import { notification_type } from "@prisma/client";

export const notificationsTuple: TuplifyUnion<notification_type> = [
	"PRODUCT_PROMOTION",
	"NEW_PRODUCT_IN_CATEGORY",
	"PRODUCT_RESTOCK",
];

export const notificationTypeEnum: UninonToEnum<notification_type> = {
	PRODUCT_PROMOTION: "PRODUCT_PROMOTION",
	NEW_PRODUCT_IN_CATEGORY: "NEW_PRODUCT_IN_CATEGORY",
	PRODUCT_RESTOCK: "PRODUCT_RESTOCK",
};

export const fullNotificationSchema = zod.object({
	title: zod.string(),
	subtitle: zod.string().optional(),
	redirect: zod.string().optional(),
	imageUrl: zod.string().optional(),
	icon: zod.string().optional(),
	userId: zod.string(),
});

export type FullNotification = Zod.infer<typeof fullNotificationSchema>;

export const notificationSchema = zod.object({
	id: zod.number(),
	productSheetId: zod.string().or(zod.null()),
	userId: zod.string(),
	categoryName: zod.string().or(zod.null()),
	type: zod.enum(notificationsTuple)
});
