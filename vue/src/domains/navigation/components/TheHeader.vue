<script setup lang="ts">
import TheNavbar from "./TheNavbar.vue";
import TheSearch from "./TheSearch.vue";
import AccountDropdown from "../components/AccountDropdown.vue";
import NotificationsDropdown from "../components/NotificationsDropdown.vue";
import MobileNavbar from "../components/MobileNavbar.vue";
import MobileSearch from "../components/MobileSearch.vue";
import { useGetNavigationBar } from "../composables/useGetNavigationBar";

const { EDITO_HOME, AUTH_LOGIN } = routerPageName;
const userStore = useUserStore();
const { items } = useGetNavigationBar();
</script>

<template>
	<header class="sticky top-0 z-10 w-full bg-white shadow-md">
		<div class="container flex items-center h-24 gap-4">
			<MobileNavbar :navigation-items="items" />

			<div class="flex items-center justify-between flex-1 gap-10 md:justify-center">
				<RouterLink
					:to="{ name: EDITO_HOME }"
					class="text-2xl font-bold"
				>
					MET
				</RouterLink>

				<div class="flex items-center justify-between gap-6 md:flex-1">
					<TheNavbar
						class="hidden md:block"
						:navigation-items="items"
					/>

					<TheSearch />

					<div class="flex items-center gap-6">
						<MobileSearch />

						<RouterLink to="/cart">
							<TheIcon
								icon="cart-outline"
								size="2xl"
							/>
						</RouterLink>

						<RouterLink
							:to="{name: AUTH_LOGIN}"
							v-if="!userStore.isConnected"
						>
							<TheButton
								variant="secondary"
								size="icon"
								class="rounded-full"
							>
								<TheIcon
									icon="account-plus-outline"
									size="2xl"
								/>
							</TheButton>
						</Routerlink>

						<div
							v-else
							class="flex gap-4"
						>
							<AccountDropdown />

							<NotificationsDropdown />
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>
</template>
