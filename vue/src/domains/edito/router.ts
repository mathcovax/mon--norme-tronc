import type { RouteRecordRaw } from "vue-router";

export const routerPageNameEdito = Object.freeze({
	EDITO_HOME: "home",
	EDITO_CGU: "cgu",
	EDIT_TO_PRIVACY_POLICY: "privacy-policy",
	EDIT_TO_DELIVERY_DETAILS: "delivery-details",
});

export default (): RouteRecordRaw[] => [
	{
		name: routerPageNameEdito.EDITO_HOME,
		path: "/",
		component: () => import("./pages/HomePage.vue"),
	},
	{
		name: routerPageNameEdito.EDITO_CGU,
		path: "/cgu",
		component: () => import("./pages/CGUPage.vue"),
	},
	{
		name: routerPageNameEdito.EDIT_TO_PRIVACY_POLICY,
		path: "/privacy-policy",
		component: () => import("./pages/PrivacyPolicy.vue"),
	},
	{
		name: routerPageNameEdito.EDIT_TO_DELIVERY_DETAILS,
		path: "/delivery-details",
		component: () => import("./pages/DeliveryDetails.vue"),
	}
];

export const notFound = (): RouteRecordRaw => ({
	path: "/:notFoundPath(.*)*",
	component: () => import("@/layouts/BaseLayout.vue"),
	children: [
		{
			name: "not-found",
			path: "/:notFoundPath(.*)*",
			component: () => import("./pages/NotFound.vue"),
		}
	]
});
