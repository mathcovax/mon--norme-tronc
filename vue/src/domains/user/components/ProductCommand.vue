<script setup lang="ts">
import type { FullCommand } from "@/lib/utils";
const { PRODUCT_PAGE } = routerPageName;

const $pt = usePageTranslate();

interface Props {
	product: FullCommand["items"][number];
}
defineProps<Props>();
</script>
<template>
	<div
		class="flex items-start gap-4 text-sm"
	>
		<img
			:src="product.productSheetFirstImageUrl"
			alt="placeholder"
			width="64"
			height="64"
			class="object-cover rounded-md aspect-square"
		>

		<div class="flex flex-col gap-1">
			<h2 class="font-bold">
				{{ product.productSheetName }}
			</h2>

			<div class="flex flex-col">
				<div class="flex items-center justify-between gap-4">
					<span>{{ $pt("product.price", { value: product.productSheetPrice }) }}</span>

					<RouterLink :to="{name: PRODUCT_PAGE, params: {productSheetId: product.productSheetId}}">
						<span class="flex items-center w-40 gap-1 border rounded-lg">
							<TheIcon
								size="xl"
								icon="rotate-right"
							/>
							{{ $pt("product.reBuy") }}
						</span>
					</RouterLink>
				</div>

				<div class="flex items-center justify-between gap-4">
					<span>{{ $pt("product.quantity", { value: product.quantity }) }}</span>

					<span>{{ $pt("product.selledBy", { value: product.productSheetOrganizationName }) }}</span>
				</div>
			</div>
		</div>
	</div>
</template>
