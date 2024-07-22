import type { RouteRecordRaw } from "vue-router";

export const routerPageNameEdito = Object.freeze({
	EDITO_HOME: "home",
	EDITO_CGU: "cgu",
	EDITO_PRIVACY_POLICY: "privacy-policy",
	EDITO_DELIVERY_DETAILS: "delivery-details",
	EDITO_RETURN_POLICY: "return-policy",
	EDITO_FAQ_ACCOUNT: "faq-account",
	EDITO_FAQ_PAYMENTS: "faq-payments",
	EDITO_FAQ_COMMANDES: "faq-commandes",
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
		component: () => import("./pages/CguPage.vue"),
	},
	{
		name: routerPageNameEdito.EDITO_PRIVACY_POLICY,
		path: "/privacy-policy",
		component: () => import("./pages/PrivacyPolicyPage.vue"),
	},
	{
		name: routerPageNameEdito.EDITO_DELIVERY_DETAILS,
		path: "/delivery-details",
		component: () => import("./pages/DeliveryDetailsPage.vue"),
	},
	{
		name: routerPageNameEdito.EDITO_RETURN_POLICY,
		path: "/return-policy",
		component: () => import("./pages/ReturnPolicyPage.vue"),
	},
	{
		name: routerPageNameEdito.EDITO_FAQ_ACCOUNT,
		path: "/faq-account",
		component: () => import("./pages/FaqAccountPage.vue"),
	},
	{
		name: routerPageNameEdito.EDITO_FAQ_PAYMENTS,
		path: "/faq-payments",
		component: () => import("./pages/FaqPaymentsPage.vue"),
	},
	{
		name: routerPageNameEdito.EDITO_FAQ_COMMANDES,
		path: "/faq-commandes",
		component: () => import("./pages/FaqCommandesPage.vue"),
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
