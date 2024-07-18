<script setup lang="ts">
interface Props {
	url: string
	alt?: string
}

defineProps<Props>();
</script>

<template>
	<div class="flex justify-center items-center aspect-square">
		<img
			:src="url"
			:alt="alt"
			class="w-full"
		>
	</div>
</template>
