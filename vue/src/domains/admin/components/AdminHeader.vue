<script setup lang="ts">
import AdminDropdown from "@/domains/navigation/components/AccountDropdown.vue";
import AdminMobileNavbar from "../components/AdminMobileNavbar.vue";

const userStore = useUserStore();
</script>

<template>
	<header class="h-24 px-8 flex gap-4 items-center border-b bg-muted/40">
		<AdminMobileNavbar />

		<div class="w-full flex-1 text-center md:text-start">
			<span class=" text-xl">
				{{ $t("layout.admin.hello", {value: userStore.user?.firstname}) }} 
				<strong>{{ userStore.user?.primordialRole ? $t(`role.${userStore.user?.primordialRole}`) : "" }}</strong>.
			</span>
		</div>

		<AdminDropdown />
	</header>
</template>
