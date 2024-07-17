import { fullCommandModel, fullProductSheetModel, productStockModel } from "@mongoose/model";
import mongooseClient from "mongoose";

export const mongoose = await mongooseClient.connect(ENV.MONGO_DATABASE_URL);
fullProductSheetModel.base = mongoose;
fullCommandModel.base = mongoose;
productStockModel.base = mongoose;
