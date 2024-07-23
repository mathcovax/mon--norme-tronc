<script setup lang="ts">
import { marked } from "marked";
import type { FullProductSheet, ProductSheetReview } from "@/lib/utils";
import ProductSlider from "../components/ProductSlider.vue";
import TheRate from "../components/TheRate.vue";
import ProductSheetQuantity from "../components/ProductSheetQuantity.vue";
import ProductSuggestion from "../components/ProductSuggestion.vue";
import { useReviewForm } from "../composables/useReviewForm";
import ReviewCard from "../components/ReviewCard.vue";
import { useGetSubscribedNotifications } from "../composables/useGetSusbcribedNotifications";

const { CATEGORY_PAGE } = routerPageName;

const $pt = usePageTranslate();
const router = useRouter();
const route = useRoute();
const { EDITO_HOME } = routerPageName;

const product = ref<FullProductSheet | null>(null);
const productQuantity = ref(1);
const cartStore = useCartStore();

const userStore = useUserStore();
const params = useRouteParams({ 
	productSheetId: zod.string(), 
});
const { subscribedNotifications, getSubscribedNotifications } = useGetSubscribedNotifications();
const { ReviewForm, checkReviewForm, resetReviewForm } = useReviewForm();

function getProductData() {
	return duploTo.enriched
		.get(
			"/full-product-sheets/{productSheetId}",
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

async function toggleSubscription(type: "PRODUCT_PROMOTION" | "PRODUCT_RESTOCK") {
	const subscribedNotification = subscribedNotifications.value.find((n) => n.type === type);

	if (subscribedNotification) {
		await duploTo.enriched
			.delete(
				"/product-notifications/{notificationId}",
				{ params: { notificationId: subscribedNotification.id } }
			);
	} else {
		await duploTo.enriched
			.post(
				"/product-notifications",
				{ productSheetId: params.value.productSheetId, type }
			);
	}
	getSubscribedNotifications(params.value.productSheetId, null);
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
getSubscribedNotifications(params.value.productSheetId, null);

watch(() => params.value.productSheetId, () => { getProductData(); });

async function sendReview() {
	const formFields = await checkReviewForm();

	if (!formFields) {
		return;
	}

	duploTo.enriched
		.post(
			"/product-sheets/{productSheetId}/reviews",
			{
				pseudo: formFields.pseudo,
				content: formFields.content,
				rate: formFields.rate,
			},
			{
				params: {
					productSheetId: params.value.productSheetId
				}
			}
		)
		.info("productSheetReview.created", () => {
			getReview(true);
			resetReviewForm();
		});
}

const owneReview = ref<ProductSheetReview>();
const reviews = ref<ProductSheetReview[]>([]);
const pageReviews = ref(0);

function getReview(owne?: boolean) {
	if (owne && !userStore.user) {
		return;
	}
	
	duploTo.enriched
		.get(
			"/product-sheets/{productSheetId}/reviews",
			{
				params: {
					productSheetId: params.value.productSheetId,
				},
				query: owne 
					? { userId: userStore.user?.id }
					: { page: pageReviews.value }
			}
		)
		.info("productSheetReviews", data => {
			if (owne) {
				owneReview.value = data[0];
				return;
			}

			reviews.value.push(...data);
			if (data.length < 10) {
				pageReviews.value = -1;
			}
			else {
				pageReviews.value++;
			}
		});
}

watch(
	() => userStore.isConnected,
	() => {
		if (userStore.isConnected) {
			getReview(true);
		}
	},
	{ immediate: true }
);

getReview();

function deleteReview() {
	if (!owneReview.value) {
		return;
	}

	duploTo.enriched
		.delete(
			"/product-sheet-reviews/{productSheetReviewId}",
			{
				params: {
					productSheetReviewId: owneReview.value._id,
				}
			}
		)
		.info("productSheetReview.deleted", () => {
			getReview(true);
		});
}

watch(
	() => route.fullPath,
	() => {
		pageReviews.value = 0;
		getReview();
		getReview(true);
	}
);
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

				<div class="flex items-center gap-4">
					<span class="text-xl font-semibold">
						{{ product.price }} €

						<span
							v-if="product.promotion"
							class="text-gray-500 line-through"
						>
							{{ product.promotion.originalPrice }} €
						</span>

						(
						<span
							v-if="product.quantity === 0"
							class="text-red-600"
						>
							{{ $pt("noStock") }}
						</span>

						<span
							v-else-if="product.quantity < 10"
							class="text-orange-600"
						>
							{{ $pt("lte10", {value: product.quantity}) }}
						</span>

						<span v-else>
							{{ product.quantity }}
						</span>
						)
					</span>

					<div class="flex items-center gap-2">
						<TheRate
							v-model:rate="product.avgRate"
							disabled
						/>

						({{ product.countRate }})
					</div>
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

				<div class="flex flex-col gap-2">
					<label
						v-if="product.quantity === 0"
						class="relative inline-flex items-center gap-2 cursor-pointer"
					>
						<input
							type="checkbox"
							class="sr-only peer"
							:checked="subscribedNotifications.some(({ type }) => type === 'PRODUCT_RESTOCK')"
							@change="toggleSubscription('PRODUCT_RESTOCK')"
						>

					
						<div class="w-11 h-6 bg-gray-200 dark:bg-light-gray peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-950" />

						<span class="inline-block opacity-50">Être notifié quand ce produit re-obtient du stock</span>

					</label>

					<label
						v-if="!product.promotion"
						class="relative inline-flex items-center gap-2 cursor-pointer"
					>

						<input
							type="checkbox"
							class="sr-only peer"
							:checked="subscribedNotifications.some(({ type }) => type === 'PRODUCT_PROMOTION')"
							@click="toggleSubscription('PRODUCT_PROMOTION')"
						>

						<div class="w-11 h-6 bg-gray-200 dark:bg-light-gray peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-950" />

						<span class="inline-block opacity-50">Être notifié quand ce produit est en promotion</span>

					</label>
				</div>

				<div
					v-if="product.variations"
					class="flex gap-2"
				>
					<RouterLink
						v-for="variation of product.variations"
						:key="variation.productSheetId"
						:to="`/product/${variation.productSheetId}`"
						class="flex flex-col items-center gap-2 bg-gray-300/40 hover:bg-gray-300/60 transition cursor-pointer w-[80px] h-[80px] p-2 rounded-sm "
						:class="{
							'outline-black outline outline-1': variation.productSheetId === product.id
						}"
					>
						<ProductImage
							:url="variation.firstImageUrl"
						/>

						<small>{{ variation.name }}</small>
					</RouterLink>
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

			<TabsContent
				value="product-details"
				class="flex flex-col gap-4"
			>
				<ul
					class="flex flex-col gap-2"
					v-if="product"
				>
					<li
						v-for="(value, facet) in product.facets"
						:key="facet"
					>
						<strong>{{ $t(`facetType.${facet}`) }}</strong> : {{ value }}
					</li>
				</ul>

				<div 
					class="prose" 
					v-html="renderDescription"
				/>
			</TabsContent>

			<TabsContent
				value="client-rates"
				class="flex flex-col gap-4"
			>
				<ReviewForm
					v-if="userStore.user?.muted === false && !owneReview"
					@submit="sendReview"
				>
					<template #rate="{modelValue, onUpdate}">
						<TheRate
							:rate="modelValue"
							@update:rate="onUpdate"
						/>
					</template>

					<div class="col-span-12">
						<PrimaryButton type="sumbite">
							{{ $t("button.send") }}
						</PrimaryButton>
					</div>
				</ReviewForm>

				<ReviewCard
					v-if="owneReview"
					:review="owneReview"
					class="w-full"
				>
					<PrimaryButton class="absolute top-4 right-4">
						<TheIcon
							icon="delete"
							@click="deleteReview"
						/>
					</PrimaryButton>
				</ReviewCard>

				<ReviewCard
					v-for="review of reviews.filter(r => r.userId !== userStore.user?.id)"
					:key="review._id"
					:review="review"
					class="w-full"
				/>

				<PrimaryButton
					v-if="pageReviews !== -1"
					@click="getReview()"
				>
					{{ $t("button.seeMore") }}
				</PrimaryButton>
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
