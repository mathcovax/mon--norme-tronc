<script setup lang="ts">
const userStore = useUserStore();
const {
	EDITO_HOME,
	USER_EDIT_PROFIL,
	USER_ORGANIZATIONS,
	ADMIN_PANEL_HOME,
	CONTENT_PANEL_HOME,
	USER_COMMANDS,
	MODERATOR_PANEL_HOME,
} = routerPageName;
</script>

<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<SecondaryButton
				size="icon"
				class="rounded-full"
			>
				<TheIcon
					icon="account-outline"
					size="2xl"
				/>
			</SecondaryButton>
		</DropdownMenuTrigger>

		<DropdownMenuContent align="end">
			<DropdownMenuLabel>
				{{ $t("layout.default.header.dropdown.myAccount") }}
			</DropdownMenuLabel>

			<DropdownMenuSeparator />

			<DropdownMenuItem>
				<RouterLink :to="{ name: USER_COMMANDS }">
					{{ $t("layout.default.header.dropdown.myCommands") }}
				</RouterLink>
			</DropdownMenuItem>

			<DropdownMenuItem>
				<RouterLink :to="{ name: USER_EDIT_PROFIL }">
					{{ $t("layout.default.header.dropdown.editProfil") }}
				</RouterLink>
			</DropdownMenuItem>

			<DropdownMenuItem v-if="userStore.user?.hasOrganization">
				<RouterLink :to="{ name: USER_ORGANIZATIONS }">
					{{ $t("layout.default.header.dropdown.myOrganizations") }}
				</RouterLink>
			</DropdownMenuItem>

			<DropdownMenuItem>{{ $t("layout.default.header.dropdown.support") }}</DropdownMenuItem>

			<DropdownMenuSeparator v-if="userStore.hasPrimordialRole('ADMIN') || userStore.hasPrimordialRole('MODERATOR') || userStore.hasPrimordialRole('CONTENTS_MASTER')" />

			<DropdownMenuLabel v-if="userStore.hasPrimordialRole('ADMIN') || userStore.hasPrimordialRole('MODERATOR') || userStore.hasPrimordialRole('CONTENTS_MASTER')">
				{{ $t("layout.default.header.dropdown.management") }}
			</DropdownMenuLabel>

			<DropdownMenuSeparator v-if="userStore.hasPrimordialRole('ADMIN') || userStore.hasPrimordialRole('MODERATOR') || userStore.hasPrimordialRole('CONTENTS_MASTER')" />

			<DropdownMenuItem v-if="userStore.hasPrimordialRole('ADMIN')">
				<RouterLink :to="{ name: ADMIN_PANEL_HOME }">
					{{ $t("layout.default.header.dropdown.admin") }}
				</RouterLink>
			</DropdownMenuItem>

			<DropdownMenuItem v-if="userStore.hasPrimordialRole('MODERATOR')">
				<RouterLink :to="{ name: MODERATOR_PANEL_HOME }">
					{{ $t("layout.default.header.dropdown.moderator") }}
				</RouterLink>
			</DropdownMenuItem>

			<DropdownMenuItem v-if="userStore.hasPrimordialRole('CONTENTS_MASTER')">
				<RouterLink :to="{ name: CONTENT_PANEL_HOME }">
					{{ $t("layout.default.header.dropdown.content") }}
				</RouterLink>
			</DropdownMenuItem>

			<DropdownMenuSeparator />

			<DropdownMenuItem>
				<RouterLink :to="{ name: EDITO_HOME }">
					{{ $t("layout.admin.dropdown.backHome") }}
				</RouterLink>
			</DropdownMenuItem>

			<DropdownMenuItem @click="userStore.removeAccessToken">
				{{ $t("layout.default.header.dropdown.logout") }}
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
