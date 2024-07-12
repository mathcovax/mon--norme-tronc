<script setup lang="ts">
import { useProductSheetForm } from "../composables/useProductSheetForm";
//@ts-expect-error missing déclaration vue3-markdown
import { VMarkdownEditor } from "vue3-markdown";
import "vue3-markdown/dist/style.css";
import FacetsForm from "../components/FacetsForm.vue";

const params = useRouteParams({ 
	organizationId: zod.string(), 
});
const { 
	ProductSheetForm, 
	checkProductSheetForm, 
	resetProductSheetForm,
	suggestedCategories,
	onSearchCategories,
	ProductSheetValues 
} = useProductSheetForm(params.value.organizationId);

const router = useRouter();
const $pt = usePageTranslate();

async function submit() {
	const formFields = await checkProductSheetForm();

	if (!formFields) {
		return; 
	}

	const result = await duploTo.enriched
		.post(
			"/organization/{organizationId}/product-sheet",
			{
				ref: formFields.ref,
				name: formFields.name,
				description: formFields.description,
				shortDescription: formFields.shortDescription,
				price: formFields.price,
				warehouseId: formFields.warehouse,
			},
			{ params: { organizationId: params.value.organizationId } }
		)
		.result;
	
	if (result.success && result.info === "productSheet.created") {
		const promiseList: unknown[] = [];

		formFields.categories?.forEach((c) => {
			promiseList.push(
				duploTo.enriched
					.post(
						"/product-sheet/{productSheetId}/category",
						{
							categoryName: c.value.toString()
						},
						{ params: { productSheetId: result.data.id } }
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
						"/product-sheet/{productSheetId}/image",
						formData,
						{ params: { productSheetId: result.data.id } }
					)
					.result
			);
		});

		formFields.facets.forEach(item => {
			promiseList.push(
				duploTo.enriched
					.post(
						"/product-sheet/{productSheetId}/facet",
						{ type: item.type, value: item.value },
						{ params: { productSheetId: result.data.id } }
					)
					.result
			);
		});

		await Promise.all(promiseList);
		resetProductSheetForm();
	}
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

		<div class="w-full flex flex-col items-center gap-6">
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

						<div class="w-full overflow-hidden grid grid-cols-3 grid-row-2 gap-3">
							<div
								v-for="(itemImage, index) of modelValue"
								:key="'id' in itemImage? itemImage.id : index"
								class=" w-full aspect-square overflow-hidden relative"
							>
								<TheIcon
									icon="delete"
									class="absolute top-2 right-2 rounded-sm bg-white hover:opacity-80 transition-all cursor-pointer"
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
					{{ $t("button.create") }}
				</PrimaryButton>
			</ProductSheetForm>

			<SecondaryButton @click="back">
				{{ $t("button.back") }}
			</secondarybutton>
		</div>
	</section>
</template>
