<script setup lang="ts">
const props = defineProps<{
	rating: number
}>();

const emit = defineEmits<(e: "update:rating", rating: number) => void>();

const currentRating = computed(() => props.rating ?? 0);

function updateRating(newRating: number) {
	emit("update:rating", newRating);
}
</script>

<template>
	<div class="flex justify-center items-center text-2xl cursor-pointer">
		<span 
			v-for="starIndex in [1, 2, 3, 4, 5]" 
			:key="starIndex" 
			:class="['star', starIndex <= currentRating ? 'text-orange-500' : 'text-gray-300']"
			class="block"
			@click="updateRating(starIndex)"
		>
			★
		</span>
	</div>
</template>
