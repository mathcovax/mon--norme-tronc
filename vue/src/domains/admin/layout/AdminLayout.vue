<script setup lang="ts">
import AdminHeader from "../components/AdminHeader.vue";
import AdminNavbar from "../components/AdminNavbar.vue";
</script>

<template>
	<div class="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
		<AdminNavbar class="h-full" />

		<div class="flex flex-col h-full overflow-hidden">
			<AdminHeader class="shrink-0" />

			<main class="flex flex-col shadow-inner-top-left grow overflow-hidden">
				<RouterView class="overflow-y-auto p-4 lg:p-8" />
			</main>
		</div>
	</div>
</template>
