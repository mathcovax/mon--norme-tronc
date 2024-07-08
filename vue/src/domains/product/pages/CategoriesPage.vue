<script setup lang="ts">
import { useGetCategories } from "../composables/useGetCategories";
import { useGetCategoriesCount } from "../composables/useGetCategoriesCount";
import ProductPagination from "../components/ProductPagination.vue";
import CategoryCard from "../components/CategoryCard.vue";

const router = useRouter();
const { EDITO_HOME } = routerPageName;
const $pt = usePageTranslate();

const query = useRouteQuery({
	page: zod.coerce.number().default(1)
});

const {
	categories,
	getCategories
} = useGetCategories({
	page: query.value.page - 1,
});
const {
	categoriesCount,
} = useGetCategoriesCount();

const currentPage = computed({
	get: () => query.value.page,
	set: (value: number) => {
		router.push({ query: { page: value } });
	}
});

watch(
	() => query.value.page,
	() => {
		getCategories({ page: query.value.page - 1 });
	}
);
</script>

<template>
	<section class="min-h-screen-nhm-mobile lg:min-h-screen-nhm-desktop container my-12 lg:my-16 flex flex-col gap-12">
		<h1 class="text-2xl lg:text-3xl font-bold">
			{{ $pt("title") }}
		</h1>

		<div v-if="categories && categories.length">
			<ProductPagination 
				v-if="currentPage > 1"
				:total="categoriesCount"
				:current-page="currentPage"
				:product-per-page="12"
				@update="page => currentPage = page"
				:key="'top-pagination-' + currentPage"
			/>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				<CategoryCard
					v-for="(category, index) in categories"
					:category="category"
					:key="index"
					class="w-full max-w-80 mx-auto"
				/>
			</div>

			<ProductPagination 
				v-if="categoriesCount > 12"
				:total="categoriesCount"
				:current-page="currentPage"
				:product-per-page="12"
				@update="page => currentPage = page"
				:key="'bottom-pagination-' + currentPage"
			/>
		</div>

		<div
			v-else
			class="flex-1 flex flex-col items-center justify-center gap-1 text-center"
		>
			<h2 class="text-2xl font-bold tracking-tight">
				{{ $pt("emptyTitle") }}
			</h2>

			<p class="text-sm text-muted-foreground">
				{{ $pt("emptySubtitle") }}
			</p>

			<PrimaryButton 
				class="mt-4"
				as-child
			>
				<RouterLink :to="{ name: EDITO_HOME }">
					{{ $pt("buttonBack") }}
				</RouterLink>
			</PrimaryButton>
		</div>
	</section>
</template>
