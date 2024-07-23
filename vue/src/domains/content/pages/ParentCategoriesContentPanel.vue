<script setup lang="ts">
import type { ParentCategory } from "@/lib/utils";
import { useGetParentCategories } from "../composables/useGetParentCategories";
import { useParentCategoryForm } from "../composables/useParentCategoryForm";
import type ThePopup from "@/components/ThePopup.vue";

const $pt = usePageTranslate(); 
const {
	ParentCategoryForm,
	onSearchCategories,
	suggestedCategories,
	checkParentCategoryForm,
	resetParentCategoryForm
} = useParentCategoryForm();
const {
	ParentCategoryForm: ParentCategoryPatchForm,
	onSearchCategories: onSearchCategoriesPatch,
	suggestedCategories: suggestedCategoriesPatch,
	checkParentCategoryForm: checkParentCategoryPatchForm,
	resetParentCategoryForm: resetParentCategoryPatchForm,
	valuesParentCategoryForm: valuesParentCategoryPatchForm
} = useParentCategoryForm();
const {
	parentCategories,
	parentCategoriesQuery,
	refreshParentCategories
} = useGetParentCategories(true);

const cols: BigTableColDef<ParentCategory>[] = [
	{
		title: $pt("table.name"),
		getter: i => i.name
	},
	{
		title: $t("label.categories"),
		getter: i => i.categories?.map(({ categoryName }) => categoryName).join(", ")
	},
	{
		title: $t("label.actions"),
		slotName: "actions"
	},
];

async function submitCreate() {
	const formField = await checkParentCategoryForm();

	if (!formField) {
		return;
	}
	
	const result = await duploTo.enriched
		.post(
			"/parent-categories",
			{ name: formField.name }
		)
		.result;

	if (result.success && result.info === "parentCategory.created") {
		const promiseList: unknown[] = [];

		formField.categories.forEach(
			c => promiseList.push(
				duploTo.enriched
					.post(
						"/parent-categories/{parentCategoryName}/categories",
						{ categoryName: c.value },
						{ params: { parentCategoryName: result.data.name } }
					)
					.result
			)
		);
		
		await Promise.all(promiseList);
		resetParentCategoryForm();
		refreshParentCategories();
	}
}

function next() {
	if (!parentCategoriesQuery.page || parentCategories.value.length < 10) {
		return;
	}
	parentCategoriesQuery.page++;
}

function previous() {
	if (!parentCategoriesQuery.page || parentCategoriesQuery.page === 0) {
		return;
	}
	parentCategoriesQuery.page--;
}

const popup = ref<InstanceType<typeof ThePopup>>();
function openPopup(parentCategory: ParentCategory) {
	valuesParentCategoryPatchForm.categories.value = parentCategory.categories
		?.map((v) => ({ label: v.categoryName, value: v.categoryName }));
	valuesParentCategoryPatchForm.name.value = parentCategory.name;
	valuesParentCategoryPatchForm.oldParentCategory.value = parentCategory;

	popup.value?.open();
}

async function submitPatch() {
	const formField = await checkParentCategoryPatchForm();

	if (
		!formField || 
		!formField.oldParentCategory || 
		!formField.oldParentCategory.categories
	) {
		return;
	}

	const result = await duploTo.enriched
		.patch(
			"/parent-categories/{parentCategoryName}",
			{ name: formField.name },
			{ params: { parentCategoryName: formField.oldParentCategory.name } }
		)
		.result;
	
	if (result.success && result.info === "parentCategory.edited") {
		const promiseList: unknown[] = [];

		formField.categories.forEach(
			c => {
				if (formField.oldParentCategory?.categories?.find(({ categoryName }) => categoryName === c.value)) {
					return; 
				}

				promiseList.push(
					duploTo.enriched
						.post(
							"/parent-categories/{parentCategoryName}/categories",
							{ categoryName: c.value },
							{ params: { parentCategoryName: formField.name } }
						)
						.result
				);
			}
		);

		formField.oldParentCategory.categories.forEach(
			c => {
				if (formField.categories.find(({ value }) => value === c.categoryName)) {
					return; 
				}

				promiseList.push(
					duploTo.enriched
						.delete(
							"/parent-categories/{parentCategoryName}/categories/{categoryName}",
							{ params: { parentCategoryName: formField.name, categoryName: c.categoryName } }
						)
						.result
				);
			}
		);

		await Promise.all(promiseList);
		refreshParentCategories();
		popup.value?.close();
		resetParentCategoryPatchForm();
	}
}
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

			<ParentCategoryForm
				@submit="submitCreate"
				class="max-w-[500px] w-[80%]"
			>
				<template #categories="{onUpdate, modelValue}">
					<MultiComboBox
						:model-value="modelValue"
						@update:model-value="onUpdate"
						:items="suggestedCategories"
						@update:search-term="onSearchCategories"
						:placeholder="$pt('label.placeholder')"
						:empty-label="$t('label.empty')"
					/>
				</template>

				<PrimaryButton
					type="submit"
					class="col-span-12"
				>
					{{ $t("button.validate") }}
				</PrimaryButton>
			</ParentCategoryForm>
		
			<div class="flex flex-col items-center w-full gap-3">
				<PrimaryInput
					class="max-w-[300px]"
					:placeholder="$pt('table.searchPlaceholder')"
					v-model="parentCategoriesQuery.name"
				/>

				<BigTable
					:items="parentCategories"
					:cols="cols"
					:current-page="(parentCategoriesQuery.page ?? 0) + 1"
					@click-next="next"
					@click-previous="previous"
				>
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
				<ParentCategoryPatchForm @submit="submitPatch">
					<template #categories="{onUpdate, modelValue}">
						<MultiComboBox
							:model-value="modelValue"
							@update:model-value="onUpdate"
							:items="suggestedCategoriesPatch"
							@update:search-term="onSearchCategoriesPatch"
							:placeholder="$pt('label.placeholder')"
							:empty-label="$t('label.empty')"
						/>
					</template>

					<PrimaryButton
						type="submit"
						class="col-span-12"
					>
						{{ $t("button.validate") }}
					</PrimaryButton>
				</parentcategorypatchform>
			</template>
		</ThePopup>
	</section>
</template>
