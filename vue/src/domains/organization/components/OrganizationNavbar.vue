<script setup lang="ts">
import type { OrganizationRole } from "@/lib/utils";
import { useGetOrganization } from "../composables/useGetOrganization";
import { useOrganizationUserStore } from "@/domains/organization/stores/organizationUser";

const { 
	ORGANIZATION_HOME,
} = routerPageName;
const route = useRoute();
const organizationUserStore = useOrganizationUserStore();

const params = useRouteParams({ 
	organizationId: zod.string(), 
});
const { organization, getOrganization } = useGetOrganization(params.value.organizationId);
getOrganization();

interface Onglet {
	pageName: (typeof routerPageName)[keyof typeof routerPageName]
	icon: string
	role?: OrganizationRole
}

const onglets: Onglet[] = [
	{
		pageName: routerPageName.ORGANIZATION_HOME,
		icon: "home-outline",
	},
	{
		pageName: routerPageName.ORGANIZATION_EDIT,
		icon: "store-edit",
		role: "OWNER",
	},
	{
		pageName: routerPageName.ORGANIZATION_COMMANDS,
		icon: "cart-outline",
		role: "STORE_KEEPER",
	},
	{
		pageName: routerPageName.ORGANIZATION_GET_PRODUCT_SHEET,
		icon: "text-box-multiple-outline",
		role: "PRODUCT_SHEET_MANAGER",
	},
	{
		pageName: routerPageName.ORGANIZATION_MANAGE_PRODUCT,
		icon: "package-variant-closed",
		role: "STORE_KEEPER",
	},
	{
		pageName: routerPageName.ORGANIZATION_MANAGE_PROMOTION,
		icon: "brightness-percent",
		role: "PRODUCT_SHEET_MANAGER"
	},
	{
		pageName: routerPageName.ORGANIZATION_GET_WAREHOUSE,
		icon: "warehouse",
		role: "OWNER",
	},
	{
		pageName: routerPageName.ORGANIZATION_MANAGE_USER,
		icon: "account",
		role: "OWNER",
	},
	{
		pageName: routerPageName.ORGANIZATION_PRODUCT_RETURN,
		icon: "clipboard-arrow-left",
		role: "STORE_KEEPER",
	},
	{
		pageName: routerPageName.ORGANIZATION_ANALYTICS,
		icon: "chart-bar",
	},
];
</script>

<template>
	<div class="hidden border-r bg-muted/40 md:block">
		<div class="flex flex-col h-full max-h-screen gap-2">
			<div class="flex items-center justify-center h-24 px-4 border-b lg:px-6">
				<RouterLink
					:to="{ name: ORGANIZATION_HOME }"
					class="flex items-center gap-2 font-semibold text-center"
				>
					<img
						v-if="organization.logoUrl"
						width="48"
						height="48"
						:src="organization.logoUrl"
						alt="logo"
						class="rounded-full"
					>

					<span>{{ organization.name || $t("layout.organization.title") }}</span>
				</RouterLink>
			</div>

			<div class="flex-1">
				<nav class="grid items-start px-2 text-sm font-medium lg:px-4">
					<template
						v-for="onglet of onglets"
						:key="onglet.pageName"
					>
						<RouterLink 
							v-if="!onglet.role || organizationUserStore.hasRole(onglet.role)"
							:to="{ name: onglet.pageName }"
							class="flex items-center gap-3 px-3 py-2 transition-all rounded-lg hover:text-primary"
							:class="
								route.name === onglet.pageName ?
									'bg-muted text-primary'
									:
									'text-muted-foreground'
							"
						>
							<TheIcon
								:icon="onglet.icon"
								size="2xl"
							/>

							{{ $t(`layout.organization.nav.${onglet.pageName}`) }}
						</RouterLink>
					</template>
				</nav>
			</div>
		</div>
	</div>
</template>
