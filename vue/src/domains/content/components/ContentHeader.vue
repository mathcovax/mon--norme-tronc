<script setup lang="ts">
import ContentDropdown from "@/domains/navigation/components/AccountDropdown.vue";
import ContentMobileNavbar from "@/domains/content/components/ContentMobileNavbar.vue";

const userStore = useUserStore();
</script>

<template>
	<header class="h-24 px-8 flex gap-4 items-center border-b bg-muted/40">
		<ContentMobileNavbar />

		<div class="w-full flex-1 text-center md:text-start">
			<span class=" text-xl">
				{{ $t("layout.content.hello", {value: userStore.user?.firstname}) }} 
				<strong>{{ userStore.user?.primordialRole ? $t(`role.${userStore.user?.primordialRole}`) : "" }}</strong>.
			</span>
		</div>

		<ContentDropdown />
	</header>
</template>
