import { fullCommandModel, fullProductSheetModel, productStatusChangeModel } from "@mongoose/model";
import mongooseClient from "mongoose";

declare global {
	const mongoose: (typeof import("./mongoose"))["mongoose"];
}

export let mongoose: typeof mongooseClient;

duplo.addHook("beforeListenHttpServer", async () => {
	//@ts-expect-error var 'global' cause type error.
	mongoose = global.mongoose = await mongooseClient.connect(ENV.MONGO_DATABASE_URL);
	fullProductSheetModel.base = mongoose;
	productStatusChangeModel.base = mongoose;
	fullCommandModel.base = mongoose;
});
