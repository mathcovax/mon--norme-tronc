<script setup lang="ts">
import type { GetDef } from "../../../lib/duploTo/EnrichedDuploTo";
import { useGetFullProductSheets } from "../composables/useGetFullProductSheets";
import ProductCard from "@/domains/product/components/ProductCard.vue";

interface Props {
	query: GetDef<
		"GET",
		"/full-product-sheets"
	>["parameters"]["query"]
}

const props = defineProps<Props>();

const {
	productSheets,
	categoryProductSheetsRefQuery
} = useGetFullProductSheets({
	available: props.query?.available ?? "true",
	take: props.query?.take ?? 20,
	...props.query,
});

watch(
	() => props.query,
	() => {
		categoryProductSheetsRefQuery.value = props.query ?? {};
	},
	{ 
		deep: true
	}
);
</script>

<template>
	<ScrollArea class="w-full pb-4">
		<div class="flex gap-6">
			<ProductCard
				v-for="(product, index) in productSheets"
				:key="index"
				:product="product"
				class="shrink-0 w-full mx-auto max-w-60"
			/>
		</div>

		<ScrollBar orientation="horizontal" />
	</ScrollArea>
</template>
