<script setup lang="ts">
import type { ProductSheetReview } from "@/lib/utils";
import TheRate from "./TheRate.vue";

interface Props {
	review: ProductSheetReview
}
defineProps<Props>();
</script>

<template>
	<div class="relative min-h-[50px] p-4 flex flex-col gap-4 border-0 rounded-md bg-gradient-to-b from-muted/50 to-muted">
		<div>
			<TheRate
				:rate="review.rate"
				disabled
			/>
		</div>

		<div class="flex flex-col gap-2">
			<span class="text-lg font-semibold">{{ review.pseudo }}</span>

			<p v-if="review.content">
				{{ review.content }}
			</p>

			<slot />
		</div>
	</div>
</template>
