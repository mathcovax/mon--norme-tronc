<script setup lang="ts">
import type { Cart } from "@/lib/utils";
import ArticleCard from "../components/ArticleCard.vue";

const { 
	CATEGORIES_PAGE,
	ORDER_PAGE,
	AUTH_LOGIN,
} = routerPageName;
const $pt = usePageTranslate();
const cartStore = useCartStore();
const userStore = useUserStore();

const addArticle = ({ quantity, ...addedArticle }: Cart[number]) => 
	cartStore.addArticle(addedArticle, 1, ["article.created"]);

const removeArticle = (productSheetId: string) =>
	cartStore.removeArticle(productSheetId);
	
</script>

<template>
	<section class="min-h-screen-nhm-mobile lg:min-h-screen-nhm-desktop container my-12 lg:my-16 flex flex-col gap-12">
		<div class="flex justify-between items-center">
			<h1 class="text-2xl font-bold lg:text-3xl">
				{{ $pt("title") }}
			</h1>

			<PrimaryButton
				v-if="cartStore.cart.length > 0"
				as-child
			>
				<RouterLink
					:to="
						userStore.isConnected
							? {name: ORDER_PAGE}
							: {name: AUTH_LOGIN, query: {redirect: ORDER_PAGE}}
					"
				>
					{{ $pt("orderButton") }}
				</RouterLink>
			</PrimaryButton>
		</div>

		<div
			v-if="cartStore.cart.length === 0"
			class="flex-1 flex flex-col justify-center items-center gap-1 text-center"
		>
			<h2 class="text-2xl font-bold tracking-tight">
				{{ $pt("emptyTitle") }}
			</h2>

			<p class="text-sm text-muted-foreground">
				{{ $pt("emptySubtitle") }}
			</p>

			<TheButton
				class="mt-4"
				as-child
			>
				<RouterLink :to="{ name: CATEGORIES_PAGE }">
					{{ $pt("browseButton") }}
				</RouterLink>
			</TheButton>
		</div>

		<ul
			v-else
			class="border-dashed flex flex-col rounded-lg border shadow-sm p-4 gap-4 min-h-[60vh]"
		>
			<li
				v-for="article in cartStore.cart"
				:key="article.productSheetId"
			>
				<ArticleCard 
					:article="article"
					@add-article="addArticle(article)"
					@remove-article="removeArticle(article.productSheetId)"
				/>
			</li>
		</ul>
	</section>
</template>
