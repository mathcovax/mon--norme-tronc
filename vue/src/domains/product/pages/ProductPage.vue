<script setup lang="ts">
import { marked } from "marked";
import type { FullProductSheet } from "@/lib/utils";
import ProductSlider from "../components/ProductSlider.vue";
import TheRate from "../components/TheRate.vue";
import ProductSheetQuantity from "../components/ProductSheetQuantity.vue";
import ProductSuggestion from "../components/ProductSuggestion.vue";

const { CATEGORY_PAGE } = routerPageName;

const $pt = usePageTranslate();
const router = useRouter();
const { EDITO_HOME } = routerPageName;

const product = ref<FullProductSheet | null>(null);
const productQuantity = ref(1);
const cartStore = useCartStore();

const params = useRouteParams({ 
	productSheetId: zod.string(), 
});

function getProductData() {
	return duploTo.enriched
		.get(
			"/full-product-sheet/{productSheetId}",
			{ params: { productSheetId: params.value.productSheetId } }
		)
		.info("fullProductSheet", (data) => {
			product.value = data;
		})
		.e(() => {
			router.push({ name: EDITO_HOME });
		})
		.result;
}

const productRate = ref(Math.ceil(2.6)); // TODO: replace with real data

function updateRate(newRate: number) {
	productRate.value = Math.ceil(newRate);
}

function createArticle() {
	if (!product.value) {
		return; 
	}

	cartStore.addArticle(
		{
			name: product.value.name,
			productSheetId: product.value.id,
			price: product.value.price,
			description: product.value.description,
			shortDescription: product.value.shortDescription,
			imageUrl: product.value.images[0]
		}, 
		productQuantity.value
	);

	productQuantity.value = 1;
}

const renderDescription = computed(() => {
	if (!product.value) {
		return "";
	}

	return marked.parse(product.value.description);
});

getProductData();

watch(() => params.value.productSheetId, () => { getProductData(); });
</script>

<template>
	<section class="container my-12 lg:my-16">
		<div
			v-if="product"
			class="flex flex-col gap-10 sm:flex-row"
		>
			<div class="w-full max-h-[430px] lg:shrink-0 max-w-80 aspect-portrait">
				<ProductSlider
					v-if="product.images.length > 0"
					:image-urls="product.images"
				/>

				<div
					v-else
					class="flex items-center justify-center w-full h-full bg-muted/80"
				>
					<TheIcon
						icon="image-outline"
						size="3xl"
						class="text-muted-foreground"
					/>
				</div>
			</div>

			<div class="flex flex-col gap-4">
				<h1 class="text-2xl font-bold lg:text-4xl">
					{{ product.name }}
					
					<template v-if="product.promotion">
						-{{ product.promotion.percentage }}%
					</template>
				</h1>

				<div class="flex flex-wrap gap-4">
					<RouterLink
						v-for="category in product.categories"
						:key="category"
						:to="{ name: CATEGORY_PAGE, params: { categoryName: category } }"
					>
						<TheBadge>
							{{ category }}
						</TheBadge>
					</RouterLink>
				</div>

				<div class="flex gap-4 items-center">
					<span class="text-xl font-semibold">
						{{ product.price }} €

						<span
							v-if="product.promotion"
							class="line-through text-gray-500"
						>
							{{ product.promotion.originalPrice }} €
						</span>

						(<span :class="{ 'text-red-600' : product.quantity < 10 }">{{ product.quantity < 10 ? "Plus que " : "" }}{{ product.quantity }}{{ product.quantity < 10 ? " !" : "" }}</span>)
					</span>

					<TheRate
						:rating="productRate"
						@update:rating="updateRate"
					/>
				</div>

				<p
					class="mt-1"
					v-if="product.promotion"
				>
					{{ product.promotion.reason }}
				</p>

				<p class="mt-1 opacity-50">
					{{ product.shortDescription }}
				</p>

				<ul class="flex flex-col gap-2">
					<li
						v-for="(value, facet) in product.facets"
						:key="facet"
					>
						<strong>{{ $t(`facetType.${facet}`) }}</strong> : {{ value }}
					</li>
				</ul>

				<div class="flex items-center gap-12 mt-4">
					<productSheetQuantity
						:quantity="productQuantity"
						:max="product.quantity"
						@increment="productQuantity++"
						@decrement="productQuantity--"
					/>

					<PrimaryButton @click="createArticle">
						{{ $pt("addCartButton") }}
					</PrimaryButton>
				</div>

				<div class="flex items-center self-end gap-2 mt-auto">
					<span class="inline-block opacity-50">Vendu par :</span>

					<div class="flex items-center gap-1">
						<span class="inline-block opacity-50">{{ product.organization.name }}</span>

						<img
							v-if="product.organization.logoUrl"
							:src="product.organization.logoUrl"
							alt="seller"
							class="object-cover w-8 h-8 rounded-full"
						>

						<TheIcon
							v-else
							icon="storefront-outline"
							size="lg"
							class="flex items-center justify-center w-8 h-8 p-1 rounded-full bg-muted/80 text-muted-foreground"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="container my-12 lg:my-16">
		<TheTabs
			default-value="product-details"
		>
			<TabsList class="grid w-full grid-cols-2 mb-6">
				<TabsTrigger value="product-details">
					{{ $pt("label.productDetails") }}
				</TabsTrigger>

				<TabsTrigger value="client-rates">
					{{ $pt("label.comments") }}
				</TabsTrigger>
			</TabsList>

			<TabsContent value="product-details">
				<div 
					class="prose" 
					v-html="renderDescription"
				/>
			</TabsContent>

			<TabsContent value="client-rates">
				Les commentaires arrivent bientôt !
			</TabsContent>
		</TheTabs>
	</section>

	<section
		v-if="product"
		class="container my-12 lg:my-16"
	>
		<h2 class="mb-4 text-2xl font-bold">
			{{ $pt("relatedProducts") }}
		</h2>

		<ProductSuggestion
			:query="{
				ignoreProductSheetId: product.id,
				target: product?.facets.TARGET,
				material: product?.facets.MATERIAL,
				stimulation: product?.facets.STIMULATION
			}"
		/>
	</section>
</template>
