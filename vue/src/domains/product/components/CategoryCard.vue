<script setup lang="ts">
import type { Category } from "@/lib/utils";
import { useGetSubscribedNotifications } from "../composables/useGetSusbcribedNotifications";

const { CATEGORY_PAGE } = routerPageName;

const props = defineProps<{
	category: Category;
}>();

const { subscribedNotifications, getSubscribedNotifications } = useGetSubscribedNotifications();

async function toggleSubscription() {
	if (subscribedNotifications.value.length !== 0) {
		await duploTo.enriched
			.delete(
				"/product-notifications/{notificationId}",
				{ params: { notificationId: subscribedNotifications.value[0].id } }
			);
	} else {
		await duploTo.enriched
			.post(
				"/product-notifications",
				{ categoryName: props.category.name, type: "NEW_PRODUCT_IN_CATEGORY" }
			);
	}
	getSubscribedNotifications(null, props.category.name);
}

getSubscribedNotifications(null, props.category.name);
</script>

<template>
	<TheCard class="border-0 rounded-md bg-gradient-to-b from-muted/50 to-muted">
		<RouterLink :to="{ name: CATEGORY_PAGE, params: { categoryName: category.name } }">
			<CardHeader>
				<img
					v-if="category.imageUrl"
					:src="category.imageUrl "
					alt="placeholder"
					class="w-full h-full aspect-portrait object-cover rounded-2xl"
				>

				<div
					v-else
					class="flex items-center justify-center w-full aspect-portrait rounded-2xl"
				>
					<TheIcon
						icon="image-outline"
						size="3xl"
						class="text-muted-foreground"
					/>
				</div>
			</CardHeader>
		</RouterLink>

		<CardContent>
			<div class="flex flex-col justify-between gap-2">
				<CardTitle class="mb-3">
					{{ category.name }}
				</CardTitle>

				<div class="flex items-center gap-4">
					<label
						class="relative inline-flex items-center gap-2 cursor-pointer"
					>
						<input
							type="checkbox"
							class="sr-only peer"
							:checked="subscribedNotifications.some(({ type }) => type === 'NEW_PRODUCT_IN_CATEGORY')"
							@click="toggleSubscription()"
						>

						<div class="w-11 h-6 bg-gray-200 dark:bg-light-gray peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-950" />

					</label>

					<span class="inline-block opacity-50">{{ $t("label.productStock") }}</span>
				</div>
			</div>
		</CardContent>
	</TheCard>
</template>
