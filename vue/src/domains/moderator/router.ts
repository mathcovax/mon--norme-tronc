import type { RouteRecordRaw } from "vue-router";

export const routerPageNameModeratorPanel = Object.freeze({
	MODERATOR_PANEL_HOME: "moderator-panel-home",
	MODERATOR_PANEL_CHECK_PRODUCT_SHEET_REVIEW: "moderator-panel-check-product-sheet-review",
	MODERATOR_PANEL_CHECK_PRODUCT_SHEET: "moderator-panel-check-product-sheet",
});

export default (): RouteRecordRaw[] => [
	{
		path: "/moderator-panel",
		component: () => import("./layout/ModeratorLayout.vue"),
		children: [
			{
				name: routerPageNameModeratorPanel.MODERATOR_PANEL_HOME,
				path: "/moderator-panel",
				component: () => import("./pages/HomeModeratorPanel.vue"),
			},
			{
				name: routerPageNameModeratorPanel.MODERATOR_PANEL_CHECK_PRODUCT_SHEET_REVIEW,
				path: "/moderator-panel/check-product-sheet-review",
				component: () => import("./pages/CheckProductSheetReview.vue"),
			},
			{
				name: routerPageNameModeratorPanel.MODERATOR_PANEL_CHECK_PRODUCT_SHEET,
				path: "/moderator-panel/check-product-sheet",
				component: () => import("./pages/CheckProductSheet.vue"),
			},
		],
	},
];
