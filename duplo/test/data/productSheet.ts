import { product_sheet } from "@prisma/client";

export const productSheetData: product_sheet = {
	id: "",
	name: "",
	description: "",
	shortDescription: "",
	price: 0,
	organizationId: "",
	warehouseId: "50",
	status: "VERIFIED",
	createdAt: new Date(),
	updatedAt: new Date(),
};
