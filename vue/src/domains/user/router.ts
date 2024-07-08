import type { RouteRecordRaw } from "vue-router";

export const routerPageNameUser = Object.freeze({
	USER_EDIT_PROFIL: "edit-profile",
	USER_ORGANIZATIONS: "my-organizations",	
	USER_CART: "cart",
	USER_BUNDLE: "user-bundle",
	USER_COMMANDS: "commands",
	USER_COMMAND: "command",
});

export default (): RouteRecordRaw[] => [
	{
		name: routerPageNameUser.USER_EDIT_PROFIL,
		path: "/edit-profile",
		component: () => import("./pages/EditProfil.vue"),
	},
	{
		name: routerPageNameUser.USER_CART,
		path: "/cart",
		component: () => import("./pages/CartPage.vue"),
	},
	{
		name: routerPageNameUser.USER_ORGANIZATIONS,
		path: "/my-organizations",
		component: () => import("./pages/UserOrganizations.vue"),
	},
	{
		name: routerPageNameUser.USER_BUNDLE,
		path: "/bundle/:bundleId",
		component: () => import("./pages/BundlePage.vue"),
	},
	{
		name: routerPageNameUser.USER_COMMANDS,
		path: "/commands",
		component: () => import("./pages/CommandsPage.vue")
	},
	{
		name: routerPageNameUser.USER_COMMAND,
		path: "/commands/:commandId",
		component: () => import("./pages/CommandPage.vue")
	},
];
