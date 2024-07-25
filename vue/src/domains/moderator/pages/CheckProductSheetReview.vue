<script setup lang="ts">
import type { ProductSheetReview } from "@/lib/utils";

const $pt = usePageTranslate();
const currentReview = ref<ProductSheetReview>();

function getReview() {
	duploTo.enriched
		.get(
			"/product-sheet-reviews",
			{
				query: {
					take: 1,
					random: "true",
					check: "false",
				}
			}
		)
		.info("productSheetReviews", data => {
			currentReview.value = data[0];
		});
}

getReview();

function checkReview() {
	if (!currentReview.value) {
		return;
	}

	duploTo.enriched
		.patch(
			"/product-sheet-reviews/{productSheetReviewId}",
			{ check: true },
			{ params: { productSheetReviewId: currentReview.value._id } }
		)
		.info("productSheetReview.edited", () => {
			getReview();
		});
}

function deleteReview() {
	if (!currentReview.value) {
		return;
	}

	duploTo.enriched
		.delete(
			"/product-sheet-reviews/{productSheetReviewId}@moderator",
			{ params: { productSheetReviewId: currentReview.value._id } }
		)
		.info("productSheetReview.deleted", () => {
			getReview();
		});
}

function muteUser() {
	if (!currentReview.value) {
		return;
	}

	duploTo.enriched
		.patch(
			"/users/{userId}@moderator",
			{ muted: true },
			{ params: { userId: currentReview.value.userId } }
		);
}

</script>

<template>
	<div class="w-full h-full flex justify-center items-center">
		<div
			v-if="currentReview"
			class="flex flex-col gap-4 items-center"
		>
			<div class="p-4 min-h-[50px] border-0 rounded-md bg-gradient-to-b from-muted/50 to-muted w-[500px]">
				<p>{{ $t("label.pseudo") }} : {{ currentReview.pseudo }}</p>

				<p>{{ $t("label.rate") }} : {{ currentReview.rate }}</p>

				<p v-if="currentReview.content">
					{{ $t("label.content") }} : {{ currentReview.content }}
				</p>
			</div>

			<div class="flex gap-4">
				<div class="flex flex-col gap-4">
					<TheButton
						variant="destructive"
						@click="muteUser(); deleteReview()"
					> 
						{{ $pt("button.deleteAndMute") }}
					</TheButton>

					<TheButton
						variant="destructive"
						@click="deleteReview"
					> 
						{{ $pt("button.delete") }}
					</TheButton>
				</div>

				<PrimaryButton @click="checkReview">
					{{ $pt("button.check") }}
				</PrimaryButton>
			</div>
		</div>

		<div
			v-else
			class="flex flex-col gap-4"
		>
			<PrimaryButton @click="getReview">
				{{ $pt("button.refresh") }}
			</PrimaryButton>

			{{ $pt("emptyReview") }}
		</div>
	</div>
</template>
