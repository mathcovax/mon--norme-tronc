<script setup lang="ts">
import { useGetOrganization } from "../composables/useGetOrganization";
import { useOrganizationUserStore } from "@/domains/organization/stores/organizationUser";

const { 
	ORGANIZATION_HOME,
	ORGANIZATION_MANAGE_USER,
	ORGANIZATION_EDIT,
	ORGANIZATION_MANAGE_PRODUCT,
	ORGANIZATION_GET_PRODUCT_SHEET,
	ORGANIZATION_GET_WAREHOUSE,
	ORGANIZATION_COMMANDS,
	ORGANIZATION_MANAGE_PROMOTION,
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
	<TheSheet>
		<SheetTrigger as-child>
			<TheButton
				variant="outline"
				size="icon"
				class="shrink-0 md:hidden"
			>
				<TheIcon
					icon="menu"
					size="2xl"
				/>
			</TheButton>
		</SheetTrigger>

		<SheetContent
			side="left"
			class="flex flex-col"
		>
			<nav class="grid gap-2 text-lg font-medium">
				<SheetClose as-child>
					<RouterLink
						:to="{ name: ORGANIZATION_HOME }"
						class="mb-6 flex flex-col items-center text-center text-2xl font-bold"
					>
						<img
							v-if="organization.logoUrl"
							width="48"
							height="48"
							:src="organization.logoUrl"
							alt="logo"
							class="rounded-full"
						>

						<span>{{ $t("layout.organization.title") }}</span>
					</RouterLink>
				</SheetClose>

				<SheetClose as-child>
					<RouterLink
						:to="{ name: ORGANIZATION_HOME }"
						class="mx-[-0.65rem] px-3 py-2 flex items-center gap-4 rounded-xl hover:text-foreground"
						:class="
							route.name === ORGANIZATION_HOME ?
								'bg-muted text-foreground'
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
				</SheetClose>

				<SheetClose as-child>
					<RouterLink
						v-if="organizationUserStore.hasRole('OWNER')"
						:to="{ name: ORGANIZATION_EDIT }"
						class="mx-[-0.65rem] px-3 py-2 flex items-center gap-4 rounded-xl hover:text-foreground"
						:class="
							route.name === ORGANIZATION_EDIT ?
								'bg-muted text-foreground'
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
				</SheetClose>

				<SheetClose as-child>
					<RouterLink
						v-if="organizationUserStore.hasRole('STORE_KEEPER')"
						:to="{ name: ORGANIZATION_COMMANDS }"
						class="mx-[-0.65rem] px-3 py-2 flex items-center gap-4 rounded-xl hover:text-foreground"
						:class="
							route.name === ORGANIZATION_COMMANDS ?
								'bg-muted text-foreground'
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
				</SheetClose>
				
				<SheetClose as-child>
					<RouterLink
						v-if="organizationUserStore.hasRole('PRODUCT_SHEET_MANAGER')"
						:to="{ name: ORGANIZATION_GET_PRODUCT_SHEET }"
						class="mx-[-0.65rem] px-3 py-2 flex items-center gap-4 rounded-xl hover:text-foreground"
						:class="
							route.name === ORGANIZATION_GET_PRODUCT_SHEET ?
								'bg-muted text-foreground'
								:
								'text-muted-foreground'
						"
					>
						<TheIcon
							icon="text-box-multiple-outline"
							size="2xl"
						/>
						{{ $t("layout.organization.nav.productSheets") }}
					</RouterLink>
				</SheetClose>
				
				<SheetClose as-child>
					<RouterLink
						v-if="organizationUserStore.hasRole('STORE_KEEPER')"
						:to="{ name: ORGANIZATION_MANAGE_PRODUCT }"
						class="mx-[-0.65rem] px-3 py-2 flex items-center gap-4 rounded-xl hover:text-foreground"
						:class="
							route.name === ORGANIZATION_MANAGE_PRODUCT ?
								'bg-muted text-foreground'
								:
								'text-muted-foreground'
						"
					>
						<TheIcon
							icon="package-variant-closed"
							size="2xl"
						/>
						{{ $t("layout.organization.nav.products") }}
					</RouterLink>
				</SheetClose>

				<SheetClose as-child>
					<RouterLink
						v-if="organizationUserStore.hasRole('PRODUCT_SHEET_MANAGER')"
						:to="{ name: ORGANIZATION_MANAGE_PROMOTION }"
						class="mx-[-0.65rem] px-3 py-2 flex items-center gap-4 rounded-xl hover:text-foreground"
						:class="
							route.name === ORGANIZATION_MANAGE_PROMOTION ?
								'bg-muted text-foreground'
								:
								'text-muted-foreground'
						"
					>
						<TheIcon
							icon="brightness-percent"
							size="2xl"
						/>
						{{ $t("layout.organization.nav.promotions") }}
					</RouterLink>
				</SheetClose>
				
				<SheetClose as-child>
					<RouterLink
						v-if="organizationUserStore.hasRole('OWNER')"
						:to="{ name: ORGANIZATION_GET_WAREHOUSE }"
						class="mx-[-0.65rem] px-3 py-2 flex items-center gap-4 rounded-xl hover:text-foreground"
						:class="
							route.name === ORGANIZATION_GET_WAREHOUSE ?
								'bg-muted text-foreground'
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
				</SheetClose>

				<SheetClose as-child>
					<RouterLink
						v-if="organizationUserStore.hasRole('OWNER')"
						:to="{ name: ORGANIZATION_MANAGE_USER }"
						class="mx-[-0.65rem] px-3 py-2 flex items-center gap-4 rounded-xl hover:text-foreground"
						:class="
							route.name === ORGANIZATION_MANAGE_USER ?
								'bg-muted text-foreground'
								:
								'text-muted-foreground'
						"
					>
						<TheIcon
							icon="account"
							size="2xl"
						/>
						{{ $t("layout.organization.nav.users") }}
					</RouterLink>
				</SheetClose>

				<SheetClose as-child>
					<RouterLink
						v-if="organizationUserStore.hasRole('ACCOUNTANT')"
						to="#"
						class="mx-[-0.65rem] px-3 py-2 flex items-center gap-4 rounded-xl hover:text-foreground"
						:class="
							!route.name ?
								'bg-muted text-foreground'
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
				</SheetClose>
			</nav>
		</SheetContent>
	</TheSheet>
</template>
