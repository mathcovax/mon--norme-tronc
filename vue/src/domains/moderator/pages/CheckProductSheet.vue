<script setup lang="ts">
import { marked } from "marked";
import type { FullProductSheet } from "@/lib/utils";

const currentFullProductSheet = ref<FullProductSheet>();

function getProductSheet() {
	duploTo.enriched
		.get("/full-product-sheets@moderator")
		.info("fullProductSheets", data => {
			currentFullProductSheet.value = data[0];
		});
}

const $pt = usePageTranslate();
getProductSheet();

function patchProductSheet(status: FullProductSheet["status"]) {
	if (!currentFullProductSheet.value) {
		return; 
	}

	duploTo.enriched
		.patch(
			"/product-sheets/{productSheetId}@moderator",
			{ status },
			{
				params: { productSheetId: currentFullProductSheet.value.id }
			}
		).info("productSheet.edited", () => {
			getProductSheet();
		});
}

</script>

<template>
	<div class="w-full h-full flex flex-col items-center">
		<div
			v-if="currentFullProductSheet"
			class="flex flex-col gap-4 items-center w-[90%]"
		>
			<div class="p-4 min-h-[50px] border-0 rounded-md bg-gradient-to-b from-muted/50 to-muted w-full flex gap-4">
				<div class="grid grid-cols-2 gap-4 shrink-0">
					<ProductImage
						v-for="imageUrl of currentFullProductSheet.images"
						:key="imageUrl"
						:url="imageUrl"
						class="h-[100px]"
					/>
				</div>

				<div class="flex flex-col items-start gap-4">
					<div class="flex flex-col">
						<p>
							{{ $t("label.ref") }} : {{ currentFullProductSheet.ref }}, {{ $t("label.id") }} : {{ currentFullProductSheet.id }}
						</p>
						
						<p>
							{{ currentFullProductSheet.organization.name }}, {{ $t("label.id") }} : {{ currentFullProductSheet.organization.id }}
						</p>

						<p>
							{{ currentFullProductSheet.name }}
						</p>
					</div>

					<TheBadge
						v-for="category of currentFullProductSheet.categories"
						:key="category"
					>
						{{ category }}
					</TheBadge>
					
					{{ currentFullProductSheet.shortDescription }}

					<ul class="flex flex-col gap-2">
						<li
							v-for="(value, facet) in currentFullProductSheet.facets"
							:key="facet"
						>
							<strong>{{ $t(`facetType.${facet}`) }}</strong> : {{ value }}
						</li>
					</ul>

					<div v-html="marked.parse(currentFullProductSheet.description)" />
				</div>
			</div>

			<div class="flex gap-4">
				<div class="flex flex-col gap-4">
					<TheButton
						variant="destructive"
						@click="patchProductSheet('REMOVE')"
					> 
						{{ $t("button.remove") }}
					</TheButton>
				</div>

				<PrimaryButton @click="patchProductSheet('VERIFIED')">
					{{ $pt("button.check") }}
				</PrimaryButton>
			</div>
		</div>

		<div
			v-else
			class="flex flex-col gap-4"
		>
			<PrimaryButton @click="getProductSheet">
				{{ $pt("button.refresh") }}
			</PrimaryButton>

			{{ $pt("emptyProductSheet") }}
		</div>
	</div>
</template>
