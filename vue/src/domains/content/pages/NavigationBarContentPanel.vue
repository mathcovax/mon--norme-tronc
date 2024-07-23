<script setup lang="ts">
import type { NavigationItem } from "@/lib/utils";
import { useNavigationItemForm } from "../composables/useNavigationItemForm";
import { useGetNavigationItem } from "../composables/useGetNavigationItem";
import type ThePopup from "@/components/ThePopup.vue";

const $pt = usePageTranslate();
const { NavigationItemForm, checkNavigationItemForm, resetNavigationItemForm } = useNavigationItemForm();
const { navigationItems, getNavigationItem } = useGetNavigationItem();
const cols: BigTableColDef<NavigationItem>[] = [
	{
		title: $t("label.type"),
		getter: i => $t(`navigationItemType.${i.type}`)
	},
	{
		title: $pt("label.priority"),
		getter: i => i.priority
	},
	{
		title: $pt("table.linked"),
		getter: i => i.type === "PARENT_CATEGORY"
			? i.parentCategoryName
			: i.type === "CATEGORY"
				? i.categoryName
				: `${i.title} : ${i.url}`
	},
	{
		title: $t("label.actions"),
		slotName: "actions"
	},
];  

async function submitCreate() {
	const formField = await checkNavigationItemForm();

	if (!formField) {
		return;
	}

	duploTo.enriched
		.post(
			"/navigation-items",
			formField
		)
		.info("navigationItem.created", () => {
			getNavigationItem();
			resetNavigationItemForm();
		});
}

const { 
	NavigationItemForm: NavigationItemPatchForm, 
	checkNavigationItemForm: checkNavigationItemPatchForm, 
	resetNavigationItemForm: resetNavigationItemPatchForm,
	navigationItemFormValues: navigationItemPatchFormValues,
} = useNavigationItemForm();

const popup = ref<InstanceType<typeof ThePopup>>();
function openPopup(navigationItem: NavigationItem) {
	navigationItemPatchFormValues.oldNavigationItem.value = navigationItem;
	navigationItemPatchFormValues.type.value = navigationItem.type;
	navigationItemPatchFormValues.priority.value = navigationItem.priority;

	if (navigationItem.type === "PARENT_CATEGORY") {
		navigationItemPatchFormValues.parentCategory.value = {
			label: navigationItem.parentCategoryName, 
			identifier: navigationItem.parentCategoryName
		};
	}
	else if (navigationItem.type === "CATEGORY") {
		navigationItemPatchFormValues.category.value = {
			label: navigationItem.categoryName, 
			identifier: navigationItem.categoryName
		};
	}
	else {
		navigationItemPatchFormValues.url.value = navigationItem.url;
		navigationItemPatchFormValues.title.value = navigationItem.title;
	}

	popup.value?.open();
}

async function submitPatch() {
	const formField = await checkNavigationItemPatchForm();

	if (!formField || !navigationItemPatchFormValues.oldNavigationItem.value) {
		return;
	}

	duploTo.enriched
		.patch(
			"/navigation-items/{navigationItemId}",
			formField,
			{ params: { navigationItemId: navigationItemPatchFormValues.oldNavigationItem.value.id } }
		)
		.info("navigationItem.edited", () => {
			popup.value?.close();
			resetNavigationItemPatchForm();
			getNavigationItem();
		});
}

function deleteItem() {
	if (!navigationItemPatchFormValues.oldNavigationItem.value) {
		return;
	}

	duploTo.enriched
		.delete(
			"/navigation-items/{navigationItemId}",
			{ params: { navigationItemId: navigationItemPatchFormValues.oldNavigationItem.value.id } }
		)
		.info("navigationItem.delete", () => {
			popup.value?.close();
			resetNavigationItemPatchForm();
			getNavigationItem();
		});
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

			<NavigationItemForm
				@click="submitCreate"
				class="max-w-[500px] w-[80%]"
			>
				<PrimaryButton class="col-span-12">
					{{ $t("button.create") }}
				</PrimaryButton>
			</NavigationItemForm>
		
			<BigTable
				:items="navigationItems"
				:cols="cols"
			>
				<template #actions="{item}">
					<SecondaryButton @click="openPopup(item)">
						<TheIcon icon="square-edit-outline" />
					</SecondaryButton>
				</template>
			</BigTable>
		</div>

		<ThePopup
			ref="popup"
			class="max-w-[500px] w-[80%]"
		>
			<template #popupContent>
				<NavigationItemPatchForm @submit="submitPatch">
					<PrimaryButton class="col-span-8">
						{{ $t("button.save") }}
					</PrimaryButton>
					
					<WithValidation
						:title="$pt('popup.title')"
						:content="$pt('popup.content')"
						class="col-span-4"
						@validate="deleteItem"
					>
						<TheButton
							type="button"
							class="w-full"
							variant="destructive"
						>
							{{ $t("button.remove") }}
						</TheButton>
					</WithValidation>
				</NavigationItemPatchForm>
			</template>
		</ThePopup>
	</section>
</template>
