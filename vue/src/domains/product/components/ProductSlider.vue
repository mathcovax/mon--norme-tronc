<script setup lang="ts">
defineProps<{
	imageUrls: string[];
}>();
</script>

<template>
	<TheCarousel 
		:items="imageUrls"
		v-slot="imageUrl"
		:visible-items="1"
		class="TheCarousel relative w-full h-full"
	>
		<div class="CarouselItem h-full flex items-center">
			<ProductImage
				:url="imageUrl.item"
				alt="product-image"
				class="w-full"
			/>
		</div>
	</TheCarousel>
</template>
