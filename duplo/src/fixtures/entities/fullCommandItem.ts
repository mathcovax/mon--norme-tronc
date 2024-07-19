import { fullCommandItemModel } from "../../mongoose/model";
import { fullCommandItemSchema } from "../../schemas/fullCommandItem";
import { uuidv7 } from "uuidv7";
import { roundDate } from "../../utils/roundDate";
function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date) {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export const addFullCommandItem = async (
	fullCommandItem: Partial<Zod.infer<typeof fullCommandItemSchema>>
) => {
	const quantity = randomInt(1, 15);
	const newFullCommandItem = new fullCommandItemModel({
		id: randomInt(1, 1000),
		commandId: uuidv7(),
		productQuantity: quantity,
		dayOfYear: roundDate(randomDate(new Date(2024, 0, 1), new Date())),
		totalValue: quantity * (fullCommandItem.productSheet?.price || 0),
		organization: {
			id: "b0b03293-3d09-4349-a1f3-39fd8b4da2f5",
			name: "Reilly, Pouros and Will",
		},
		...fullCommandItem,
	});
	return newFullCommandItem.save();
};
