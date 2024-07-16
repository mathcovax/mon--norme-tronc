
<script setup lang="ts">
import type { Cart } from "@/lib/utils";

interface Props {
	article: Cart[number];
}

const { PRODUCT_PAGE } = routerPageName;
const $pt = usePageTranslate();

defineProps<Props>();
const emit = defineEmits<{
	addArticle: [];
	removeArticle: [];
	deleteArticle: [];
}>();

const updateQuantity = (amount: number) => {
	if (amount === 1) {
		emit("addArticle");
	}
	
	if (amount === -1) {
		emit("removeArticle");
	}
};
</script>

<template>
	<TheCard class="flex flex-col items-center justify-between gap-4 p-6 transition-colors border-b sm:flex-row sm:gap-0 hover:bg-muted/50">
		<div class="flex items-center gap-8">
			<CardHeader class="p-0">
				<img
					:src="article.imageUrl"
					alt="placeholder"
					width="64"
					height="64"
					class="object-cover rounded-md aspect-square"
				>
			</CardHeader>

			<CardContent class="flex flex-col gap-1 p-0">
				<RouterLink :to="{name: PRODUCT_PAGE, params: {productSheetId: article.productSheetId}}">
					<CardTitle>
						{{ article.name }}
					</CardTitle>
				</RouterLink>

				<CardDescription>
					{{ article.shortDescription }}
				</CardDescription>
			</CardContent>
		</div>

		<CardFooter class="flex items-center gap-8 p-0">
			<div class="flex items-center gap-4">
				<WithValidation
					:title="$pt('popup.title')"
					:content="$pt('popup.content')"
					class="col-span-4"
					:disabled="article.quantity > 1"
					@disabled-click="updateQuantity(-1)"
					@validate="updateQuantity(-1)"
				>
					<PrimaryButton
						type="button"
						class="w-[40px] h-[40px] rounded-full"
						:variant="article.quantity > 1 ? undefined : 'destructive'"
					>
						<TheIcon :icon="article.quantity > 1 ? 'minus' : 'delete-outline'" />
					</PrimaryButton>
				</WithValidation>

				<span class="text-lg font-bold">{{ article.quantity }}</span>

				<PrimaryButton
					@click="updateQuantity(1)"
					class="cursor-pointer w-[40px] h-[40px] flex items-center justify-center rounded-full bg-primary text-white"
					as-child
				>
					<TheIcon icon="plus" />
				</PrimaryButton>
			</div>

			<p class="text-lg font-semibold">
				{{ (article.price * article.quantity).toFixed(2) }}&nbsp;€
			</p>
		</CardFooter>
	</TheCard>
</template>
