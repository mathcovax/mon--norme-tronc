<script setup lang="ts">
import { useGetWarehouses } from "../composables/useGetWarehouses";
import type { Warehouse } from "@/lib/utils";
import type ThePopup from "@/components/ThePopup.vue";
import { useWarehouseForm } from "../composables/useWarehouseForm";

const params = useRouteParams({ 
	organizationId: zod.string(), 
});
const { warehouses, getWarehouses } = useGetWarehouses(params.value.organizationId);
const { WarehouseForm, warehouseValues, checkWarehouseForm, resetWarehouseForm } = useWarehouseForm();
const $pt = usePageTranslate();
const currentPage = ref(0);
const searchName = ref("");
const creatForm = ref(false);
const popup = ref<InstanceType<typeof ThePopup>>();
const cols: BigTableColDef<Warehouse>[] = [
	{
		title: $t("label.lastname"),
		getter: i => i.name
	},
	{
		title: $t("label.address"),
		getter: i => i.address
	},
	{
		title: $t("label.actions"),
		slotName: "actions"
	},
];

function next() {
	if (warehouses.value.length < 10) {
		return;
	}
	getWarehouses(currentPage.value+=1, searchName.value);
}

function previous() {
	if (currentPage.value === 0) {
		return;
	}
	getWarehouses(currentPage.value-=1, searchName.value);
}

async function submitPatch() {
	const formFields = await checkWarehouseForm();

	if (!formFields) {
		return;
	}

	if (!formFields.warehouse?.id) {
		return;
	}

	duploTo.enriched
		.patch(
			"/warehouse/{warehouseId}",
			{
				name: formFields.name,
				address: formFields.address
			},
			{ params: { warehouseId: formFields.warehouse.id } }
		).info("warehouse.edited", () => {
			resetWarehouseForm();
			getWarehouses(currentPage.value=0, searchName.value="");
			popup.value?.close();
		});
}

function openPopup(warehouse: Warehouse) {
	warehouseValues.warehouse.value = warehouse;
	warehouseValues.name.value = warehouse.name;
	warehouseValues.address.value = { identifier: warehouse.address, label: warehouse.address };
	popup.value?.open();
}

async function submitPost() {

	const formFields = await checkWarehouseForm();

	if (!formFields) {
		return; 
	}

	await duploTo.enriched
		.post(
			"/organization/{organizationId}/warehouse",
			{
				name: formFields.name,
				address: formFields.address
			},
			{ params: { organizationId: params.value.organizationId } }
		)
		.info("warehouse.created", () => {
			resetWarehouseForm();
			getWarehouses(currentPage.value, searchName.value);
		});
}

function openCreateForm() {
	resetWarehouseForm();
	creatForm.value = !creatForm.value;
}

getWarehouses(currentPage.value, searchName.value);
watch(searchName, () => getWarehouses(0, searchName.value));
</script>

<template>
	<section>
		<h1 class="mb-12 text-2xl font-semibold">
			{{ $pt("title") }}
		</h1>

		<div class="flex flex-col items-center w-full gap-6 p-6">
			<div
				v-if="creatForm"
				class="w-full flex flex-col items-center p-6 gap-6"
			>
				<h2 class="text-xl font-semibold">
					{{ $pt("form.title") }}
				</h2>

				<WarehouseForm
					@submit="submitPost"
					class="max-w-[500px] w-[80%]"
				>
					<PrimaryButton
						type="submit"
						class="col-span-12"
					>
						{{ $t("button.create") }}
					</PrimaryButton>
				</WarehouseForm>
			</div>

			<div class="flex justify-center w-full gap-[1rem]">
				<PrimaryInput
					class="max-w-[300px]"
					:placeholder="$pt('searchPlaceholder')"
					v-model="searchName"
				/>

				<PrimaryButton @click="openCreateForm">
					<div v-if="creatForm">
						<TheIcon icon="menu-down" />
						{{ $t("button.cancel") }}
					</div>

					<div v-else>
						<TheIcon icon="menu-up" />
						{{ $t("button.create") }}
					</div>
				</PrimaryButton>
			</div>

			<BigTable
				:items="warehouses"
				:cols="cols"
				:current-page="currentPage + 1"
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

		<ThePopup
			ref="popup"
			class="max-w-[500px] w-[80%]"
			@close="resetWarehouseForm()"
		>
			<template #popupContent>
				<WarehouseForm
					@submit="submitPatch"
					class="items-center"
				>
					<template #warehouse="{modelValue}">
						<span class="text-center">Modifier <strong>{{ modelValue?.name }}</strong></span>
					</template>

					<PrimaryButton
						type="submit"
						class="col-span-12"
					>
						{{ $t("form.submit") }}
					</PrimaryButton>
				</WarehouseForm>
			</template>
		</ThePopup>
	</section>
</template>
