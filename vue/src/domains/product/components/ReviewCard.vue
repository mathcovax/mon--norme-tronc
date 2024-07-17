<script setup lang="ts">
import type { ProductSheetReview } from "@/lib/utils";

interface Props {
	review: ProductSheetReview
}
defineProps<Props>();
</script>

<template>
	<div class="p-4 min-h-[50px] border-0 rounded-md bg-gradient-to-b from-muted/50 to-muted relative">
		<p>{{ review.rate }}</p>

		<p>{{ review.pseudo }}</p>

		<p v-if="review.content">
			{{ review.content }}
		</p>

		<slot />
	</div>
</template>
