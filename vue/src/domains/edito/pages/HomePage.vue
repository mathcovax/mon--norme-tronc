<script setup lang="ts">
import ProductSuggestion from "@/domains/product/components/ProductSuggestion.vue";

const { CATEGORIES_PAGE } = routerPageName;
const $pt = usePageTranslate(); 
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

				<PrimaryButton
					size="lg"
					class="mt-8 w-min"
					as-child
				>
					<RouterLink :to="{ name: CATEGORIES_PAGE }">
						{{ $pt("button.discover") }}
					</RouterLink>
				</PrimaryButton>
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

		<ProductSuggestion :query="{}" />

		<SecondaryButton 
			size="lg"
			variant="outline"
			class="mt-4"
			as-child
		>
			<RouterLink :to="{ name: CATEGORIES_PAGE }">
				{{ $pt("button.more") }}
			</RouterLink>
		</SecondaryButton>
	</section>

	<hr class="container h-px my-16 ">

	<section class="container mb-12 lg:mb-16 flex flex-col gap-8 lg:gap-12 items-center">
		<h2 class="text-2xl lg:text-3xl font-bold">
			{{ $pt("sectionWomanTitle") }}
		</h2>

		<ProductSuggestion :query="{ target: 'woman' }" />

		<SecondaryButton 
			size="lg"
			variant="outline"
			class="mt-4"
			as-child
		>
			<RouterLink :to="{ name: CATEGORIES_PAGE }">
				{{ $pt("button.more") }}
			</RouterLink>
		</SecondaryButton>
	</section>

	<hr class="container h-px my-16 ">

	<section class="container mb-12 lg:mb-16 flex flex-col gap-8 lg:gap-12 items-center">
		<h2 class="text-2xl lg:text-3xl font-bold">
			{{ $pt("sectionManTitle") }}
		</h2>

		<ProductSuggestion :query="{ target: 'man' }" />

		<SecondaryButton 
			size="lg"
			variant="outline"
			class="mt-4"
			as-child
		>
			<RouterLink :to="{ name: CATEGORIES_PAGE }">
				{{ $pt("button.more") }}
			</RouterLink>
		</SecondaryButton>
	</section>
</template>
