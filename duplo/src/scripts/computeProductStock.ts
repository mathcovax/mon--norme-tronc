import "./setup";
import { mongoose } from "./setup/mongoose";
import { FindSlice } from "@utils/findSlice";
import { PromiseList } from "./setup/promiseList";
import { fullProductSheetModel, productStockModel } from "@mongoose/model";
import { FullProductSheetSchema } from "@schemas/fullProductSheet";
import { roundDate } from "@utils/roundDate";

const fullProductSheetGenerator = FindSlice(
	500,
	(slice, size) => fullProductSheetModel.aggregate<FullProductSheetSchema>([
		{ $skip: slice * size },
		{ $limit: size }
	])
);

const promiseList = new PromiseList(100);
const today = roundDate(new Date());

for await (const fullProductSheet of fullProductSheetGenerator) {
	await promiseList.append(
		productStockModel.findOneAndUpdate(
			{ productSheetId: fullProductSheet.id, date: today },
			{ 
				productSheetId: fullProductSheet.id,
				quantity: fullProductSheet.quantity,
				date: today
			},
			{ new: true, upsert: true }
		)
	);
}

await promiseList.clear();

mongoose.connection.close();

console.log("Finish computeProductStock");
