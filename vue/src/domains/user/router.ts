import type { RouteRecordRaw } from "vue-router";

export const routerPageNameUser = Object.freeze({
	USER_EDIT_PROFIL: "edit-profile",
	USER_ORGANIZATIONS: "my-organizations",	
	USER_CART: "cart",
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
];
