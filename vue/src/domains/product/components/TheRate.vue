<script setup lang="ts">
interface Props {
	disabled?: boolean
}

const props = defineProps<Props>();

const rateModel = defineModel<string | number>(
	"rate",
	{ required: true }
);

const currentRating = computed(() => Number(rateModel.value));

function onClick(star: number) {
	if (props.disabled) {
		return;
	}
	rateModel.value = star;
}

</script>

<template>
	<div class="flex items-center text-2xl select-none">
		<span 
			v-for="starIndex in [1, 2, 3, 4, 5]" 
			:key="starIndex"
			:class="{
				'cursor-pointer star': !disabled,
				'text-orange-500': starIndex <= currentRating,
			}"
			class="block text-gray-300"
			@click="onClick(starIndex)"
		>
			★
		</span>
	</div>
</template>

<style>
.star:hover {
	-webkit-text-stroke: 1px black;
}
</style>
