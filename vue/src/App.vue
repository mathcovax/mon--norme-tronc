<script setup lang="ts">
import TheToaster from "@/components/ui/toast/TheToaster.vue";

const route = useRoute();
const container = ref<HTMLElement | null>(null);

watch(
	() => route.fullPath,
	() => {
		if (container.value) {
			container.value.scrollTo(0, 0);
		}
	}
);
</script>

<template>
	<TheLoader />

	<div
		ref="container"
		class="w-full h-full overflow-auto"
	>
		<RouterView />

		<CheckAgeModal />
	</div>

	<TheToaster	/>
</template>
