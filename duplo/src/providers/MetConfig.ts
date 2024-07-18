declare global {
	const MetConfig: typeof import("./MetConfig")["MetConfig"];
}

export const MetConfig = {
	cart: {
		articlesLimit: 10,
		quantityLimit: 15,
	},
	navigationBar: {
		itemsLimit: 10
	},
	parentCategory: {
		categoriesLimit: 10
	},
	productSheet: {
		imagesLimit: 6,
		categoriesLimit: 5,
		full: {
			organizationLimit: 10,
		},
		reviewLimit: 10,
	},
	stripe: {
		timestampSession: 30*60, // 30 min
	},
	bundle: {
		pullingInterval: 5000 
	},
	command: {
		commandLimit: 10
	},
	productReturn: {
		productReturnLimit: 10,
	},
	user: {
		pathTempDataFile: "/tmp",
		intervalPullData: 1000 * 60 * 30, // 30 min
	}
};
//@ts-expect-error var 'global' cause type error.
global.MetConfig = MetConfig;
