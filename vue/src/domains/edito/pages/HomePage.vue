<script setup lang="ts">
// import type { CategoryProductSheet } from "@/lib/utils";
// import ProductCard from "@/domains/product/components/ProductCard.vue";

const $pt = usePageTranslate(); 

// const products = ref<CategoryProductSheet[]>([
// 	{
// 		id: "1",
// 		name: "Petit tronc",
// 		description: "Pour un moment tranquille sans écorce.",
// 		shortDescription: "Pour un moment tranquille sans écorce.",
// 		price: 59,
// 		organizationId: "1",
// 	},
// 	{
// 		id: "2",
// 		name: "Grand tronc",
// 		description: "Pour un moment tranquille avec écorce.",
// 		shortDescription: "Pour un moment tranquille avec écorce.",
// 		price: 99,
// 		organizationId: "1",
// 	},
// 	{
// 		id: "3",
// 		name: "Énorme tronc",
// 		description: "Pour un moment tranquille avec écorce, feuilles et fruits.",
// 		shortDescription: "Pour un moment tranquille avec écorce, feuilles et fruits.",
// 		price: 199,
// 		organizationId: "1",
// 	},
// ]);
</script>

<template>
	<section class="h-screen-nh mb-12 lg:mb-16 bg-whiteless">
		<div class="h-full container flex flex-col lg:flex-row gap-12 lg:gap-24">
			<div class="h-1/2 lg:h-full flex flex-col justify-center">
				<h1 class="text-3xl lg:text-5xl font-bold">
					{{ $pt("heroTitle") }}
				</h1>

				<p class="mt-4 text-base lg:text-lg font-medium opacity-50">
					{{ $pt("heroSubtitle") }}
				</p>

				<TheButton
					size="lg"
					class="mt-8 w-min"
				>
					{{ $pt("button.discover") }}
				</TheButton>
			</div>

			<div class="h-1/2 lg:h-full">
				<img
					src="/images/hero.png"
					alt="placeholder"
					class="w-full h-full object-cover"
				>
			</div>
		</div>
	</section>

	<section class="container mb-12 lg:mb-16 flex flex-col gap-8 lg:gap-12 items-center">
		<h2 class="text-2xl lg:text-3xl font-bold">
			{{ $pt("sectionNewTitle") }}
		</h2>

		<ScrollArea class="w-full">
			<div class="flex gap-6 justify-center">
				<!-- <ProductCard
						v-for="product in products"
						:key="product.name"
						:product="product"
						class="w-44 lg:w-64"
					/> -->
			</div>

			<ScrollBar orientation="horizontal" />
		</ScrollArea>

		<TheButton
			size="lg"
			variant="outline"
			class="w-min"
		>
			{{ $pt("button.more") }}
		</TheButton>
	</section>

	<hr class="max-w-screen-xl h-px mx-auto my-16 border-0 bg-black opacity-10">

	<section class="container mb-12 lg:mb-16 flex flex-col gap-8 lg:gap-12 items-center">
		<h2 class="text-2xl lg:text-3xl font-bold">
			{{ $pt("sectionBestSellerTitle") }}
		</h2>

		<ScrollArea class="w-full">
			<div class="flex gap-6 justify-center">
				<!-- <ProductCard
						v-for="product in products"
						:key="product.name"
						:product="product"
						class="w-44 lg:w-64"
					/> -->
			</div>

			<ScrollBar orientation="horizontal" />
		</ScrollArea>

		<TheButton
			size="lg"
			variant="outline"
			class="w-min"
		>
			{{ $pt("button.more") }}
		</TheButton>
	</section>

	<section class="container mb-12 lg:mb-16">
		<div
			class="max-w-240 lg:h-192 mx-auto px-6 lg:px-16 py-10 lg:py-20 flex flex-col gap-8 lg:gap-12 items-center bg-whiteless rounded-3xl"
		>
			<h2 class="text-2xl lg:text-3xl font-bold">
				{{ $pt("sectionPackTitle") }}
			</h2>

			<div class="w-full h-192 lg:h-[calc(100%-5.25rem)] grid grid-cols-6 grid-rows-12 lg:grid-rows-6 gap-5">
				<div class="col-span-6 lg:col-span-4 row-span-3">
					<img
						src="https://via.placeholder.com/250"
						alt="placeholder"
						class="w-full h-full object-cover rounded-2xl"
					>
				</div>

				<div class="col-span-6 lg:col-span-2 row-span-3 row-start-4 lg:row-start-1 lg:col-start-5">
					<img
						src="https://via.placeholder.com/250"
						alt="placeholder"
						class="w-full h-full object-cover rounded-2xl"
					>
				</div>

				<div class="col-span-6 lg:col-span-2 row-span-3 row-start-7 lg:row-start-4">
					<img
						src="https://via.placeholder.com/250"
						alt="placeholder"
						class="w-full h-full object-cover rounded-2xl"
					>
				</div>

				<div class="col-span-6 lg:col-span-4 row-span-3 lg:col-start-3 row-start-10 lg:row-start-4">
					<img
						src="https://via.placeholder.com/250"
						alt="placeholder"
						class="w-full h-full object-cover rounded-2xl"
					>
				</div>
			</div>
		</div>
	</section>
</template>
