<script setup lang="ts">
import { useGetOrganization } from "../composables/useGetOrganization";
import { useOrganizationUserStore } from "@/domains/organization/stores/organizationUser";

const { 
	ORGANIZATION_HOME,
	ORGANIZATION_MANAGE_USER,
	ORGANIZATION_EDIT,
	ORGANIZATION_MANAGE_PRODUCT,
	ORGANIZATION_MANAGE_PROMOTION,
	ORGANIZATION_GET_PRODUCT_SHEET,
	ORGANIZATION_GET_WAREHOUSE,
	ORGANIZATION_COMMANDS,
} = routerPageName;
const route = useRoute();
const organizationUserStore = useOrganizationUserStore();

const params = useRouteParams({ 
	organizationId: zod.string(), 
});
const { organization, getOrganization } = useGetOrganization(params.value.organizationId);

getOrganization();
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
					<RouterLink
						:to="{ name: ORGANIZATION_HOME }"
						class="flex items-center gap-3 px-3 py-2 transition-all rounded-lg hover:text-primary"
						:class="
							route.name === ORGANIZATION_HOME ?
								'bg-muted text-primary'
								:
								'text-muted-foreground'
						"
					>
						<TheIcon
							icon="home-outline"
							size="2xl"
						/>
						{{ $t("layout.organization.nav.dashboard") }}
					</RouterLink>

					<RouterLink
						v-if="organizationUserStore.hasRole('OWNER')"
						:to="{ name: ORGANIZATION_EDIT }"
						class="flex items-center gap-3 px-3 py-2 transition-all rounded-lg hover:text-primary"
						:class="
							route.name === ORGANIZATION_EDIT ?
								'bg-muted text-primary'
								:
								'text-muted-foreground'
						"
					>
						<TheIcon
							icon="store-edit"
							size="2xl"
						/>
						{{ $t("layout.organization.nav.organizationEdit") }}
					</RouterLink>

					<RouterLink
						v-if="organizationUserStore.hasRole('STORE_KEEPER')"
						:to="{ name: ORGANIZATION_COMMANDS }"
						class="flex items-center gap-3 px-3 py-2 transition-all rounded-lg hover:text-primary"
						:class="
							route.name === ORGANIZATION_COMMANDS ?
								'bg-muted text-primary'
								:
								'text-muted-foreground'
						"
					>
						<TheIcon
							icon="cart-outline"
							size="2xl"
						/>
						{{ $t("layout.organization.nav.orders") }}
					</RouterLink>

					<RouterLink
						v-if="organizationUserStore.hasRole('PRODUCT_SHEET_MANAGER')"
						:to="{ name: ORGANIZATION_GET_PRODUCT_SHEET }"
						class="flex items-center gap-3 px-3 py-2 transition-all rounded-lg hover:text-primary"
						:class="
							route.name === ORGANIZATION_GET_PRODUCT_SHEET 
								? 'bg-muted text-primary'
								: 'text-muted-foreground'
						"
					>
						<TheIcon
							icon="text-box-multiple-outline"
							size="2xl"
						/>
						{{ $t("layout.organization.nav.productSheets") }}
					</RouterLink>

					<RouterLink
						v-if="organizationUserStore.hasRole('STORE_KEEPER')"
						:to="{ name: ORGANIZATION_MANAGE_PRODUCT }"
						class="flex items-center gap-3 px-3 py-2 transition-all rounded-lg hover:text-primary"
						:class="
							route.name === ORGANIZATION_MANAGE_PRODUCT 
								? 'bg-muted text-primary'
								: 'text-muted-foreground'
						"
					>
						<TheIcon
							icon="package-variant-closed"
							size="2xl"
						/>
						{{ $t("layout.organization.nav.products") }}
					</RouterLink>

					<RouterLink
						v-if="organizationUserStore.hasRole('PRODUCT_SHEET_MANAGER')"
						:to="{ name: ORGANIZATION_MANAGE_PROMOTION }"
						class="flex items-center gap-3 px-3 py-2 transition-all rounded-lg hover:text-primary"
						:class="
							route.name === ORGANIZATION_MANAGE_PROMOTION 
								? 'bg-muted text-primary'
								: 'text-muted-foreground'
						"
					>
						<TheIcon
							icon="brightness-percent"
							size="2xl"
						/>
						{{ $t("layout.organization.nav.promotions") }}
					</RouterLink>

					<RouterLink
						v-if="organizationUserStore.hasRole('OWNER')"
						:to="{ name: ORGANIZATION_GET_WAREHOUSE }"
						class="flex items-center gap-3 px-3 py-2 transition-all rounded-lg hover:text-primary"
						:class="
							route.name === ORGANIZATION_GET_WAREHOUSE ?
								'bg-muted text-primary'
								:
								'text-muted-foreground'
						"
					>
						<TheIcon
							icon="warehouse"
							size="2xl"
						/>
						{{ $t("layout.organization.nav.warehouse") }}
					</RouterLink>

					<RouterLink
						v-if="organizationUserStore.hasRole('OWNER')"
						:to="{ name: ORGANIZATION_MANAGE_USER }"
						class="flex items-center gap-3 px-3 py-2 transition-all rounded-lg hover:text-primary"
						:class="
							route.name === ORGANIZATION_MANAGE_USER 
								? 'bg-muted text-primary'
								: 'text-muted-foreground'
						"
					>
						<TheIcon
							icon="account"
							size="2xl"
						/>
						{{ $t("layout.organization.nav.users") }}
					</RouterLink>

					<RouterLink
						v-if="organizationUserStore.hasRole('ACCOUNTANT')"
						to="#"
						class="flex items-center gap-3 px-3 py-2 transition-all rounded-lg hover:text-primary"
						:class="
							!route.name ?
								'bg-muted text-primary'
								:
								'text-muted-foreground'
						"
					>
						<TheIcon
							icon="chart-line"
							size="2xl"
						/>
						{{ $t("layout.organization.nav.analytics") }}
					</RouterLink>
				</nav>
			</div>
		</div>
	</div>
</template>

