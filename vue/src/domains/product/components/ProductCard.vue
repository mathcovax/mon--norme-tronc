<script setup lang="ts">
import type { FullProductSheet } from "@/lib/utils";
import TheRate from "./TheRate.vue";

const { PRODUCT_PAGE } = routerPageName;

defineProps<{
	product: FullProductSheet;
}>();

</script>

<template>
	<TheCard class="border-0 rounded-md bg-gradient-to-b from-muted/50 to-muted">
		<RouterLink
			:to="{ name: PRODUCT_PAGE, params: { productSheetId: product.id } }"
			class="flex flex-col h-full"
		>
			<CardHeader>
				<ProductImage
					v-if="product.images.length > 0"
					:url="product.images[0]"
					alt="product"
					class="w-full rounded-2xl"
				/>

				<div
					v-else
					class="flex items-center justify-center w-full aspect-square rounded-2xl"
				>
					<TheIcon
						icon="image-outline"
						size="3xl"
						class="text-muted-foreground"
					/>
				</div>
			</CardHeader>

			<CardContent class="flex-1">
				<CardTitle
					class="mb-3 text-xl title-ellipsis"
					:title="product.name"
				>
					{{ product.name }}

					<template v-if="product.promotion">
						-{{ product.promotion.percentage }}%
					</template>
				</CardTitle>

				<CardDescription class="w-fit description-ellipsis">
					{{ product.shortDescription }}
				</CardDescription>
			</CardContent>

			<CardFooter class="justify-end">
				<div class="flex flex-col items-end">
					<div class="flex gap-2 items-center">
						<TheRate
							:rate="product.avgRate"
							disabled
						/>
						
						({{ product.countRate }})
					</div>

					<div class="flex gap-2 ">
						<span>{{ product.price }} €</span>

						<span
							v-if="product.promotion"
							class="line-through text-gray-500"
						>
							{{ product.promotion.originalPrice }} €
						</span>
					</div>
				</div>
			</CardFooter>
		</RouterLink>
	</TheCard>
</template>

<style scoped>
.title-ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	/* number of lines to show */
	-webkit-box-orient: vertical;
}

.description-ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 5;
	/* number of lines to show */
	-webkit-box-orient: vertical;
}
</style>
