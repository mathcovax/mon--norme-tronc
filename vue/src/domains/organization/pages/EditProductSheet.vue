<script setup lang="ts">
import SecondaryButton from "@/components/SecondaryButton.vue";
import { useProductSheetForm } from "../composables/useProductSheetForm";
//@ts-expect-error missing déclaration vue3-markdown
import { VMarkdownEditor } from "vue3-markdown";
import "vue3-markdown/dist/style.css";
import FacetsForm from "../components/FacetsForm.vue";

const params = useRouteParams({ 
	organizationId: zod.string(), 
	productSheetId: zod.string() 
});
const { 
	ProductSheetForm, 
	checkProductSheetForm, 
	suggestedCategories,
	onSearchCategories,
	ProductSheetValues,
} = useProductSheetForm(params.value.organizationId, params.value.productSheetId);
const $pt = usePageTranslate();

const router = useRouter();

async function submit() {
	const formFields = await checkProductSheetForm();

	if (!formFields) {
		return; 
	}

	const result = await duploTo.enriched
		.patch(
			"/product-sheets/{productSheetId}",
			{
				name: formFields.name,
				description: formFields.description,
				shortDescription: formFields.shortDescription,
				price: formFields.price,
				warehouseId: formFields.warehouse,
				variationGroup: formFields.variationGroup,
				variationName: formFields.variationName,
			},
			{ params: { productSheetId: params.value.productSheetId } }
		)
		.result;

	if (result.success && result.info === "productSheet.edited") {
		const promiseDeleteList: unknown[] = [];

		formFields.oldCategories?.forEach((c) => {
			if (formFields.categories?.find(({ value }) => value === c.value)) {
				return;
			}

			promiseDeleteList.push(
				duploTo.enriched
					.delete(
						"/product-sheets/{productSheetId}/categories/{categoryName}",
						{ params: { categoryName: c.value.toString(), productSheetId: params.value.productSheetId } }
					)
					.result
			);
		});

		formFields.oldImages?.forEach(item => { 
			if (formFields.images.find(i => item.id === i.id)) {
				return;
			}

			promiseDeleteList.push(
				duploTo.enriched
					.delete(
						"/image-product-sheet/{imageProductSheetId}",
						{ params: { imageProductSheetId: item.id } }
					)
					.result
			);
		});

		formFields.oldFacets?.forEach(item => {
			if (formFields.facets.find(({ type }) => item.type === type)) {
				return;
			}

			promiseDeleteList.push(
				duploTo.enriched
					.delete(
						"/product-sheets/{productSheetId}/facets/{facetType}",
						{ params: { facetType: item.type, productSheetId: params.value.productSheetId } }
					)
					.result
			);
		});

		await Promise.all(promiseDeleteList);
		const promiseList: unknown[] = [];

		formFields.categories.forEach((c) => {
			if (formFields.oldCategories?.find(({ value }) => value === c.value)) {
				return;
			}

			promiseList.push(
				duploTo.enriched
					.post(
						"/product-sheets/{productSheetId}/categories",
						{
							categoryName: c.value.toString()
						},
						{ params: { productSheetId: params.value.productSheetId } }
					)
					.result
			);
		});

		formFields.images.forEach(item => { 
			if (!item.blob) {
				return;
			}

			const formData = new FormData();
			formData.append("image", item.blob);

			promiseList.push(
				duploTo
					.post(
						"/product-sheets/{productSheetId}/images",
						formData,
						{ params: { productSheetId: params.value.productSheetId } }
					)
					.result
			);
		});

		formFields.facets.forEach(item => {
			const oldFacet = formFields.oldFacets?.find(({ type }) => type === item.type);
			if (oldFacet) {
				if (oldFacet.value !== item.value) {
					promiseList.push(
						duploTo.enriched
							.patch(
								"/product-sheets/{productSheetId}/facets/{facetType}",
								{ value: item.value },
								{ params: { productSheetId: params.value.productSheetId, facetType: item.type } }
							)
							.result
					);
				}
				
				return;
			}

			promiseList.push(
				duploTo.enriched
					.post(
						"/product-sheets/{productSheetId}/facets",
						{ type: item.type, value: item.value },
						{ params: { productSheetId: params.value.productSheetId } }
					)
					.result
			);
		});

		await Promise.all(promiseList);
	}

	back();
}

function back() {
	router.push({ 
		name: routerPageName.ORGANIZATION_GET_PRODUCT_SHEET, 
		params: { organizationId: params.value.organizationId } 
	});
}

const inputFile = ref<null | HTMLInputElement>(null);
function addImage() {
	if (!inputFile.value?.files?.[0]) {
		return; 
	}

	ProductSheetValues.images.value = [
		...ProductSheetValues.images.value, 
		{ blob: inputFile.value.files[0], url: URL.createObjectURL(inputFile.value.files[0]) }
	];
	
	inputFile.value.value = "";
}
</script>

<template>
	<section>
		<h1 class="mb-12 text-2xl font-semibold">
			{{ $pt("title") }}
		</h1>

		<div class="w-full flex flex-col items-center p-6 gap-6">
			<ProductSheetForm
				@submit="submit"
				class="max-w-[500px] w-[80%]"
			>
				<template #categories="{onUpdate, modelValue}">
					<MultiComboBox
						:model-value="modelValue"
						@update:model-value="onUpdate"
						:items="suggestedCategories"
						@update:search-term="onSearchCategories"
						:placeholder="$pt('form.placeholder')"
						:empty-label="$t('label.empty')"
					/>
				</template>

				<template #description="{onUpdate, modelValue}">
					<VMarkdownEditor
						:model-value="modelValue"
						@update:model-value="onUpdate"
						class="min-h-96"
					/>
				</template>

				<template #images="{modelValue, onUpdate}">
					<div class="flex flex-col items-center gap-3">
						<input
							ref="inputFile"
							type="file"
							class="fixed top-full left-full"
							accept="image/png, image/jpeg"
							@input="addImage"
						>

						<SecondaryButton
							type="button"
							@click="inputFile?.click()"
							:disabled="ProductSheetValues.images.value.length > 5"
						>
							<TheIcon icon="plus" />
							{{ $pt("form.addImage") }}
						</SecondaryButton>

						<div class="grid w-full grid-cols-3 gap-3 overflow-hidden grid-row-2">
							<div
								v-for="(itemImage, index) of modelValue"
								:key="'id' in itemImage? itemImage.id : index"
								class="relative w-full overflow-hidden aspect-square"
							>
								<TheIcon
									icon="delete"
									class="absolute transition-all bg-white rounded-sm cursor-pointer top-2 right-2 hover:opacity-80"
									@click="onUpdate(modelValue.filter(i => i!==itemImage))"
								/>

								<img
									:src="itemImage.url"
									class="col-span-1 row-span-1"
								>
							</div>
						</div>
					</div>
				</template>

				<template #facets="{modelValue, onUpdate}">
					<FacetsForm
						:model-value="modelValue"
						@update:model-value="onUpdate"
					/>
				</template>
			
				<PrimaryButton
					type="submit"
					class="col-span-12"
				>
					{{ $t("button.save") }}
				</PrimaryButton>
			</ProductSheetForm>

			<SecondaryButton @click="back">
				{{ $t("button.back") }}
			</secondarybutton>
		</div>
	</section>
</template>
