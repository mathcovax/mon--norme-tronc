import "./setup";
import { FullProductSheetSchema } from "@schemas/fullProductSheet";
import { FindSlice } from "@utils/findSlice";
import { mongoose } from "./setup/mongoose";
import { FullCommandItemSchema } from "@schemas/fullCommandItem";
import { LastTime } from "./setup/lastTime";
import { PromiseList } from "./setup/promiseList";
import { fullCommandItemModel } from "@mongoose/model";
import { roundDate } from "@utils/roundDate";

const newLastIndexing = new Date();
const lastTime = new LastTime("indexingCommandItem");
const lastIndexing = await lastTime.get();

const commandItemGenerator = FindSlice(
	500,
	(slice, size) => prisma.command_item.findMany({
		select: {
			id: true,
			commandId: true,
			quantity: true,
			freezeProductSheet: true,
			updatedAt: true,
		},
		where: {
			updatedAt: {
				gte: lastIndexing
			},
			canceled: false,
		},
		take: size,
		skip: slice * size,
	})
);

const promiseList = new PromiseList(1000);

for await (const commandItem of commandItemGenerator) {
	const fps = JSON.parse(commandItem.freezeProductSheet) as FullProductSheetSchema;

	const fullCommandItem : FullCommandItemSchema = {
		id: commandItem.id,
		commandId: commandItem.commandId,
		productQuantity: commandItem.quantity,
		dayOfYear: roundDate(commandItem.updatedAt, 1),
		totalValue: commandItem.quantity * fps.price,
		organization: {
			id: fps.organization.id,
			name: fps.organization.name,
		},
		productSheet: {
			id: fps.id,
			name: fps.name,
			ref: fps.ref,
			price: fps.price,
			categories: fps.categories,
			imageUrl: fps.images[0] ?? "",
			facets: fps.facets
		},
	};

	await promiseList.append(
		fullCommandItemModel.findOneAndUpdate(
			{ id: commandItem.id },
			fullCommandItem,
			{ new: true, upsert: true }
		)
	);
}

await promiseList.clear();

await lastTime.set(newLastIndexing);

mongoose.connection.close();
