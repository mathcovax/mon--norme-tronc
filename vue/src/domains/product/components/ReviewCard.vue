<script setup lang="ts">
import type { ProductSheetReview } from "@/lib/utils";
import TheRate from "./TheRate.vue";

interface Props {
	review: ProductSheetReview
}
defineProps<Props>();
</script>

<template>
	<div class="p-4 min-h-[50px] border-0 rounded-md bg-gradient-to-b from-muted/50 to-muted relative">
		<div>
			<TheRate
				:rate="review.rate"
				disabled
			/>
		</div>

		<p>{{ review.pseudo }}</p>

		<p v-if="review.content">
			{{ review.content }}
		</p>

		<slot />
	</div>
</template>
