<script setup lang="ts">
import OrganizationHeader from "../components/OrganizationHeader.vue";
import OrganizationNavbar from "../components/OrganizationNavbar.vue";
import { useOrganizationUserStore } from "../stores/organizationUser";

const organizationUserStore = useOrganizationUserStore();

onMounted(() => {
	organizationUserStore.fetchOrganizationValue();
});

onUnmounted(() => {
	organizationUserStore.resetOrganizationValue();
});
</script>

<template>
	<div class="grid h-full w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] overflow-hidden">
		<OrganizationNavbar class="h-full" />

		<div class="flex flex-col h-full overflow-hidden">
			<OrganizationHeader class="shrink-0" />

			<main class="flex flex-col shadow-inner-top-left grow overflow-hidden">
				<RouterView class="overflow-y-auto p-4 lg:p-6" />
			</main>
		</div>
	</div>
</template>
