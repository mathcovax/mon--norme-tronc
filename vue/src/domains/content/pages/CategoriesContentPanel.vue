<script setup lang="ts">
import { useCategoryForm } from "../composables/useCategoryForm";
import { useGetCategories } from "../composables/useGetCategories";
import type { Category } from "@/lib/utils";
import type ThePopup from "@/components/ThePopup.vue";

const $pt = usePageTranslate(); 

const { 
	CategoryForm: CreateCategoryForm, 
	checkCategoryForm: checkCreateCategoryForm, 
	resetCategoryForm: resetCreateCategoryForm,
	valuesCategoryForm: valuesCreateCategoryForm,
} = useCategoryForm();
const { 
	CategoryForm: PatchCategoryForm, 
	checkCategoryForm: checkPatchCategoryForm, 
	resetCategoryForm: resetPatchCategoryForm,
	valuesCategoryForm: valuesPatchCategoryForm
} = useCategoryForm();
const { categories, getCategories } = useGetCategories();
const currentPage = ref(0);
const searchName = ref("");
const popup = ref<InstanceType<typeof ThePopup>>();
const cols: BigTableColDef<Category>[] = [
	{
		title: $pt("table.col.name"),
		getter: i => i.name
	},
	{
		title: $pt("table.col.disabled"),
		slotName: "disabled", 
	},
	{
		title: $t("label.image"),
		slotName: "image", 
	},
	{
		title: $t("label.actions"),
		slotName: "actions"
	},
];

const inputFileCreate = ref<null | HTMLInputElement>(null);
function addImageCreate() {
	if (!inputFileCreate.value?.files?.[0]) {
		return; 
	}

	valuesCreateCategoryForm.image.value = {
		blob: inputFileCreate.value.files[0],
		url: URL.createObjectURL(inputFileCreate.value.files[0])
	};
	
	inputFileCreate.value.value = "";
}

async function submitCreate() {
	const formFields = await checkCreateCategoryForm();

	if (!formFields || !formFields.image.blob) {
		return; 
	}

	const result = await duploTo.enriched
		.post(
			"/categories",
			{ name: formFields.name, disabled: formFields.disabled }
		)
		.result;
	
	if (result.success && result.info === "category.created") {
		const formData = new FormData();
		formData.append("image", formFields.image.blob);
		
		await duploTo
			.put(
				"/category/{categoryName}/image",
				formData,
				{ params: { categoryName: result.data.name } }
			)
			.result;

		resetCreateCategoryForm();
		getCategories(currentPage.value = 0, searchName.value = "");
	}
}

const inputFilePatch = ref<null | HTMLInputElement>(null);
function addImagePatch() {
	if (!inputFilePatch.value?.files?.[0]) {
		return; 
	}

	valuesPatchCategoryForm.image.value = {
		blob: inputFilePatch.value.files[0],
		url: URL.createObjectURL(inputFilePatch.value.files[0])
	};
	
	inputFilePatch.value.value = "";
}

async function submitPatch() {
	const formFields = await checkPatchCategoryForm();

	if (!formFields) {
		return; 
	}

	const result = await duploTo.enriched
		.patch(
			"/categories/{categoryName}",
			{ name: formFields.name, disabled: formFields.disabled },
			{ params: { categoryName: formFields.oldName } }
		)
		.result;
	
	if (result.success && result.info === "category.edited") {
		if (formFields.image.blob) {
			const formData = new FormData();
			formData.append("image", formFields.image.blob);
		
			await duploTo
				.put(
					"/category/{categoryName}/image",
					formData,
					{ params: { categoryName: formFields.name } }
				)
				.result;
		}

		popup.value?.close();
		resetPatchCategoryForm();
		getCategories(currentPage.value, searchName.value);
	}
}

function next() {
	if (categories.value.length < 10) {
		return;
	}
	getCategories(currentPage.value+=1, searchName.value);
}

function previous() {
	if (currentPage.value === 0) {
		return;
	}
	getCategories(currentPage.value-=1, searchName.value);
}

function openPopup(category: Category) {
	valuesPatchCategoryForm.oldName.value = category.name;
	valuesPatchCategoryForm.name.value = category.name;
	valuesPatchCategoryForm.disabled.value = category.disabled;
	valuesPatchCategoryForm.image.value = { url: category.imageUrl || "" };
	popup.value?.open();
}

watch(
	searchName,
	() => {
		getCategories(currentPage.value, searchName.value);
	}
);
getCategories(currentPage.value, searchName.value);
</script>

<template>
	<section>
		<h1 class="mb-12 text-2xl font-semibold">
			{{ $pt("title") }}
		</h1>

		<div class="w-full flex flex-col items-center p-6 gap-10">
			<h2 class="text-xl font-semibold">
				{{ $pt("form.title") }}
			</h2>

			<CreateCategoryForm
				@submit="submitCreate"
				class="max-w-[500px] w-[80%]"
			>
				<template #image="{modelValue}">
					<div class="flex flex-col items-start gap-3">
						<input
							ref="inputFileCreate"
							type="file"
							class="fixed top-full left-full"
							accept="image/png, image/jpeg"
							@input="addImageCreate"
						>

						<SecondaryButton
							type="button"
							@click="inputFileCreate?.click()"
						>
							<TheIcon icon="plus" />
							{{ $pt("form.selectImage") }}
						</SecondaryButton>

						<div
							v-if="modelValue"
							class="aspect-square overflow-hidden w-[100px]"
						>
							<img :src="modelValue.url">
						</div>
					</div>
				</template>

				<PrimaryButton
					type="submit"
					class="col-span-12"
				>
					{{ $t("button.validate") }}
				</PrimaryButton>
			</CreateCategoryForm>

			<div class="flex flex-col items-center w-full gap-3">
				<PrimaryInput
					class="max-w-[300px]"
					:placeholder="$pt('table.searchPlaceholder')"
					v-model="searchName"
				/>

				<BigTable
					:items="categories"
					:cols="cols"
					:current-page="currentPage + 1"
					@click-next="next"
					@click-previous="previous"
				>
					<template #disabled="{item}">
						<TheIcon
							:icon="item.disabled ? 'close' : 'check'"
							:class="{
								'text-green-400': !item.disabled, 
								'text-red-400': item.disabled
							}"
						/>
					</template>

					<template #image="{item}">
						<div class="aspect-square overflow-hidden w-[30px]">
							<img :src="item.imageUrl || ''">
						</div>
					</template>

					<template #actions="{item}">
						<SecondaryButton @click="openPopup(item)">
							<TheIcon icon="square-edit-outline" />
						</SecondaryButton>
					</template>
				</BigTable>
			</div>
		</div>

		<ThePopup
			ref="popup"
			class="max-w-[500px] w-[80%]"
		>
			<template #popupContent>
				<PatchCategoryForm @submit="submitPatch">
					<template #oldName="{modelValue}">
						<span class="text-center">{{ $pt("form.oldName.label", { currentName: modelValue }) }}</span>
					</template>

					<template #image="{modelValue}">
						<div class="flex flex-col items-start gap-3">
							<input
								ref="inputFilePatch"
								type="file"
								class="fixed top-full left-full"
								accept="image/png, image/jpeg"
								@input="addImagePatch"
							>

							<SecondaryButton
								type="button"
								@click="inputFilePatch?.click()"
							>
								<TheIcon icon="plus" />
								{{ $pt("form.selectImage") }}
							</SecondaryButton>

							<div
								v-if="modelValue"
								class="aspect-square overflow-hidden w-[100px]"
							>
								<img
									:src="modelValue.url"
									class="col-span-1 row-span-1"
								>
							</div>
						</div>
					</template>

					<PrimaryButton
						type="submit"
						class="col-span-12"
					>
						{{ $t("button.validate") }}
					</PrimaryButton>
				</PatchCategoryForm>
			</template>
		</ThePopup>
	</section>
</template>
