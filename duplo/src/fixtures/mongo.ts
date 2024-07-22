import "../scripts/setup";
import { mongooseClient } from "./mongooseClient";
import { addFullCommandItem } from "./entities/fullCommandItem";
import { fullProductSheetModel } from "../mongoose/model";
import { FullProductSheetSchema } from "../schemas/fullProductSheet";

const commandCount = 1000;

async function getRandomDocumentFullProductSheet() {
	try {
		const count = await fullProductSheetModel.countDocuments();
		const randomIndex = Math.floor(Math.random() * count);
		const randomDoc = await fullProductSheetModel.findOne().skip(randomIndex);
		return randomDoc as unknown as FullProductSheetSchema;
	} catch (err) {
		console.error(err);
		throw err;
	}
}

export const main = async () => {
	try {
		const client = await mongooseClient();
		for (let i = 0; i < commandCount; i++) {
			const fullProductSheet = await getRandomDocumentFullProductSheet(); 
			await addFullCommandItem({ 
				productSheet: {
					id: fullProductSheet.id,
					name: fullProductSheet.name,
					ref: fullProductSheet.ref,
					price: fullProductSheet.price,
					categories: fullProductSheet.categories,
					imageUrl: "beureur",
					facets: fullProductSheet.facets,
				},
			});
		}
		await client.disconnect();
		console.log("Done");
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};
main();
