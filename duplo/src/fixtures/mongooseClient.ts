import env from "../env";
import mongoose from "mongoose";
import { fullCommandItemModel, fullProductSheetModel } from "../mongoose/model";

export const mongooseClient = async () => {
	const client = await mongoose.connect(env.MONGO_DATABASE_URL);
	fullCommandItemModel.base = client;
	fullProductSheetModel.base = client;
	console.log("Connected to MongoDB");

	return client;
};
