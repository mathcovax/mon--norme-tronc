import type { RouteRecordRaw } from "vue-router";

export const routerPageNameOrganization = Object.freeze({
	ORGANIZATION_HOME: "organization-panel",
	ORGANIZATION_EDIT: "organization-panel-organization-edit",
	ORGANIZATION_MANAGE_USER: "organization-panel-manage-user",
	ORGANIZATION_MANAGE_PRODUCT: "organization-panel-manage-product",
	ORGANIZATION_MANAGE_PROMOTION: "organization-panel-manage-promotion",
	ORGANIZATION_CREATE_PRODUCT_SHEET: "organization-panel-create-product-sheet",
	ORGANIZATION_EDIT_PRODUCT_SHEET: "organization-panel-edit-product-sheet",
	ORGANIZATION_GET_PRODUCT_SHEET: "organization-panel-get-product-sheet",
	ORGANIZATION_GET_WAREHOUSE: "organization-panel-get-warehouse",
	ORGANIZATION_COMMANDS: "organization-commands",
	ORGANIZATION_PRODUCT_RETURN: "organization-product-return",
});

export default (): RouteRecordRaw[] => [
	{
		path: "/organization-panel",
		component: () => import("./layout/OrganizationLayout.vue"),
		children: [
			{
				name: routerPageNameOrganization.ORGANIZATION_HOME,
				path: "/organization-panel/:organizationId",
				component: () => import("./pages/OrganizationsPage.vue"),
			},
			{
				name: routerPageNameOrganization.ORGANIZATION_EDIT,
				path: "/organization-panel/:organizationId/manage",
				component: () => import("./pages/EditOrganization.vue"),
			},
			{
				name: routerPageNameOrganization.ORGANIZATION_MANAGE_USER,
				path: "/organization-panel/:organizationId/manage-user",
				component: () => import("./pages/ManageUserOrganization.vue"),
			},
			{
				name: routerPageNameOrganization.ORGANIZATION_CREATE_PRODUCT_SHEET,
				path: "/organization-panel/:organizationId/create-product-sheet",
				component: () => import("./pages/CreateProductSheet.vue")
			},
			{
				name: routerPageNameOrganization.ORGANIZATION_EDIT_PRODUCT_SHEET,
				path: "/organization-panel/:organizationId/edit-product-sheet/:productSheetId",
				component: () => import("./pages/EditProductSheet.vue")
			},
			{
				name: routerPageNameOrganization.ORGANIZATION_GET_PRODUCT_SHEET,
				path: "/organization-panel/:organizationId/product-sheets",
				component: () => import("./pages/ProductSheets.vue")
			},
			{
				name: routerPageNameOrganization.ORGANIZATION_GET_WAREHOUSE,
				path: "/organization-panel/:organizationId/warehouses",
				component: () => import("./pages/WarehousesPage.vue")
			},
			{
				name: routerPageNameOrganization.ORGANIZATION_MANAGE_PRODUCT,
				path: "/organization-panel/:organizationId/products",
				component: () => import("./pages/ProductsOrganization.vue")
			},
			{
				name: routerPageNameOrganization.ORGANIZATION_COMMANDS,
				path: "/organization-panel/:organizationId/commands",
				component: () => import("./pages/CommandsOrganization.vue")
			},
			{
				name: routerPageNameOrganization.ORGANIZATION_MANAGE_PROMOTION,
				path: "/organization-panel/:organizationId/promotions",
				component: () => import("./pages/PromotionsOrganization.vue")
			},
			{
				name: routerPageNameOrganization.ORGANIZATION_PRODUCT_RETURN,
				path: "/organization-panel/:organizationId/product-return",
				component: () => import("./pages/ProductReturn.vue")
			}
		]
	}
];
