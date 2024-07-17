import { fullCommandSchema } from "@schemas/command";
import { fullProductSheetSchema } from "@schemas/fullProductSheet";
import { productSheetReviewSchema } from "@schemas/productSheetReview";
import { productStatusChangeSchema } from "@schemas/productStatusChange";
import { fullNotificationSchema } from "@schemas/userNotification";
import { zodToMongooseSchema } from "@utils/zodToMongooseSchema";
import { productStockSchema } from "@schemas/ProductStock";
import { model } from "mongoose";

const fullProductSheetMongooseSchema = zodToMongooseSchema(fullProductSheetSchema);
export const fullProductSheetModel = model(
	"FullProductSheet",
	fullProductSheetMongooseSchema.index({ 
		name: "text", 
		shortDescription: "text",
		description: "text",
		ref: "text",
	})
);

const productStatusChangeMongooseSchema = zodToMongooseSchema(productStatusChangeSchema);
export const productStatusChangeModel = model(
	"productStatusChange",
	productStatusChangeMongooseSchema
);

const fullCommandMongooseSchema = zodToMongooseSchema(fullCommandSchema);
export const fullCommandModel = model(
	"FullCommand",
	fullCommandMongooseSchema
);

const fullNotificationsMongooseSchema = zodToMongooseSchema(fullNotificationSchema);
export const fullNotificationsModel = model(
	"UserNotification",
	fullNotificationsMongooseSchema	
);

const productStockMongooseSchema = zodToMongooseSchema(productStockSchema);
export const productStockModel = model(
	"ProductStock",
	productStockMongooseSchema
);

const productSheetReviewMongooseSchema = zodToMongooseSchema(productSheetReviewSchema.omit({ _id: true }));
export const productSheetReviewModel = model(
	"productSheetReview",
	productSheetReviewMongooseSchema
);
