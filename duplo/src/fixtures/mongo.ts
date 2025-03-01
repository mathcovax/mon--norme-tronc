import "../scripts/setup";
import { mongooseClient } from "./mongooseClient";
import { addFullCommandItem } from "./entities/fullCommandItem";
import { fullProductSheetModel } from "../mongoose/model";
import { FullProductSheetSchema } from "../schemas/fullProductSheet";

const commandCount = 4000;

async function getRandomDocumentFullProductSheet() {
	try {
		const [fps] = await fullProductSheetModel.aggregate<FullProductSheetSchema>([{ $sample: { size: 1 } }]);
		return fps;
	} catch (err) {
		console.error(err);
		throw err;
	}
}

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
		},
		{ id: fullProductSheet.organization.id, name: fullProductSheet.organization.name }
		);
	}
	await client.disconnect();
	console.log("Done");
} catch (error) {
	console.error(error);
	process.exit(1);
}
