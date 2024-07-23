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
	fullCommandItem: Partial<Zod.infer<typeof fullCommandItemSchema>>,
	organization: { id: string; name: string }
) => {
	const quantity = randomInt(1, 15);
	const newFullCommandItem = new fullCommandItemModel({
		id: randomInt(1, 1000),
		commandId: uuidv7(),
		productQuantity: quantity,
		dayOfYear: roundDate(randomDate(new Date(2024, 0, 1), new Date()), 1),
		totalValue: quantity * (fullCommandItem.productSheet?.price || 0),
		organization: organization,
		...fullCommandItem,
	});
	return newFullCommandItem.save();
};
