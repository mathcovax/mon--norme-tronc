import { user } from "@prisma/client";

export const userData: user = {
	id: "rere",
	email: "test",
	lastname: "DOE",
	firstname: "jhon",
	dateOfBirth: new Date(2002, 8, 13),
	address: "test",
	primordialRole: "ADMIN",
	muted: false,
	emailNotifcationsNewsletter: true,
	emailNotifcationsProductStock: true,
	emailNotifcationsPromotion: true,
	emailNotifcationsNewProductsInCategory: true,
};
