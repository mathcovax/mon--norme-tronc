<script setup lang="ts">
import type { OrganizationCommandCollection, OrganizationCommandDetailes, Warehouse } from "@/lib/utils";
import { useGetCommands } from "../composables/useGetCommands";
import { useGetWarehouses } from "../composables/useGetWarehouses";
import { effect } from "vue";
import type ThePopup from "@/components/ThePopup.vue";
import { useBundleForm } from "../composables/useBundleForm";

const params = useRouteParams({ 
	organizationId: zod.string(), 
});
const { 
	commandRefQuery, 
	organizationCommandCollection,
	refreshCommand,
} = useGetCommands(params.value.organizationId, { page: 0, warehouseId: "none" });
const {
	warehouses,
	getWarehouses,
} = useGetWarehouses(params.value.organizationId);
const $pt = usePageTranslate();
const cols: BigTableColDef<OrganizationCommandCollection[number]>[] = [
	{
		title: $pt("table.id"),
		getter: i => i.commandId,
	},
	{
		title: $pt("table.quantity"),
		getter: i => i.quantity
	},
	{
		title: $pt("table.date"),
		getter: i => i.createdAt?.split("T")[0]
	},
];
const popup = ref<InstanceType<typeof ThePopup>>();
const selectWareHouse = ref<Warehouse | null>(null);
const currentPage = computed({
	get: () => commandRefQuery.value.page ?? 1,
	set: (value: number) => {
		commandRefQuery.value.page = value;
	}
});
const { 
	BundleForm, 
	findProducts, 
	getProducts, 
	resetBundleForm, 
	checkBundleForm,
} = useBundleForm(params.value.organizationId);
const currentCommand = ref<null | OrganizationCommandCollection[number]>(null);

function next() {
	if (organizationCommandCollection.value.length < 10) {
		return;
	}
	currentPage.value++;
}

function previous() {
	if (currentPage.value === 0) {
		return;
	}
	currentPage.value --;
}

effect(() => {
	commandRefQuery.value.warehouseId = selectWareHouse.value?.id ?? "none";
});

const commandDetailes = ref<OrganizationCommandDetailes>([]);
function openPopup(command: OrganizationCommandCollection[number]) {
	duploTo.enriched
		.get(
			"/organizations/{organizationId}/commands/{commandId}/details",
			{
				params: {
					organizationId: params.value.organizationId,
					commandId: command.commandId,
				}
			}
		)
		.info("organizationCommandDetailes", (data) => {
			commandDetailes.value = data;
			resetBundleForm();
			popup.value?.open();
			currentCommand.value = command;
		})
		.info("commandItem.missing", () => {
			currentCommand.value = null;
			popup.value?.close();
			refreshCommand();
		});
}

async function createBundle() {
	const formfield = await checkBundleForm();
	const command = currentCommand.value;

	if (!formfield || !command) {
		return;
	}

	duploTo.enriched
		.post(
			"/organizations/{organizationId}/commands/{commandId}/make-bundle",
			formfield,
			{
				params: {
					organizationId: params.value.organizationId,
					commandId: command.commandId,
				}
			}
		)
		.then(() => openPopup(command));
	
}

</script>

<template>
	<section>
		<h1 class="mb-12 text-2xl font-semibold">
			{{ $pt("title") }}
		</h1>

		<div class="flex flex-col items-center w-full gap-6 p-6">
			<PrimaryComboBox
				class="w-[300px]"
				:items="warehouses"
				:filter-function="v => v"
				:get-identifier="w => w.id"
				:get-label="w => w.name"
				@update:search-term="name => getWarehouses(0, name)"
				v-model="selectWareHouse"
				:text-button="$pt('cb.textButton')"
				:empty-label="$t('label.empty')"
				:placeholder="$pt('cb.placeholder')"
			/>

			<BigTable
				:items="organizationCommandCollection"
				:cols="cols"
				:current-page="currentPage + 1"
				@click-next="next"
				@click-previous="previous"
				@click-on-row="i => openPopup(i)"
			/>
		</div>

		<ThePopup
			ref="popup"
			class="w-[90%] flex flex-col gap-6"
			@close="refreshCommand"
		>
			<template #popupContent>
				<div>
					<p>{{ $t("label.address") }} : {{ currentCommand?.address }}</p>

					<p>{{ $t("label.lastname") }} : {{ currentCommand?.lastname }}</p>

					<p>{{ $t("label.firstname") }} : {{ currentCommand?.firstname }}</p>
				</div>

				<BigTable
					:items="commandDetailes"
					:cols="[
						{
							title: $pt('table.image'),
							slotName: 'img'
						},
						{
							title: $pt('table.productSheetName'),
							getter: i => i.productSheetName
						},
						{
							title: $pt('table.productSheetRef'),
							getter: i => i.productSheetRef
						},
						{
							title: $pt('table.quantityRest'),
							getter: i => i.quantity - i.processQuantity
						},
						{
							title: $pt('table.quantity'),
							getter: i => i.quantity
						},
					]"
				>
					<template #img="{item}">
						<div class="aspect-square w-[100px] flex justify-center items-center col-span-2">
							<img :src="item.productSheetFirstImageUrl">
						</div>
					</template>
				</BigTable>

				<div class="w-[500px] self-center">
					<BundleForm @submit="createBundle">
						<template #bundleItems="{onUpdate, modelValue}">
							<SecondaryButton
								type="button"
								@click="onUpdate([...modelValue, {}])"
							>
								{{ $pt("form.addItem") }}
							</SecondaryButton>

							<div
								v-for="(bundleItem, index) of modelValue"
								:key="index"
								class="grid grid-cols-12 gap-3"
							>
								<PrimarySelect
									class="col-span-5"
									:items="commandDetailes
										.filter(cd => {
											const computedProcess = modelValue.reduce((pv, cv) => cv.productSheetId === cd.productSheetId ? pv + 1 : pv, 0);
											return (cd.processQuantity + computedProcess) < cd.quantity || !!bundleItem.commandItemId
										})
										.map(cd => ({label: cd.productSheetName, value: cd.commandItemId}))"
									:model-value="bundleItem.commandItemId"
									@update:model-value="value => { 
										bundleItem.commandItemId = value; 
										bundleItem.productSheetId = commandDetailes.find(cd => cd.commandItemId.toString() === value)?.productSheetId;
										onUpdate([...modelValue]);
									}"
								/>

								<PrimaryComboBox
									class="col-span-6"
									:disabled="!bundleItem.productSheetId"
									:items="findProducts.filter(i => !modelValue.find(bi => bi.sku === i))"
									:empty-label="$t('label.empty')"
									:text-button="$pt('form.butonSku')"
									:placeholder="$pt('form.placeholderSku')"
									:get-label="i => i"
									:get-identifier="i => i"
									@update:search-term="value => getProducts(value, bundleItem.productSheetId)"
									:model-value="bundleItem.sku"
									@update:model-value="value => { 
										bundleItem.sku = value; 
										onUpdate([...modelValue]);
										getProducts('*');
									}"
								/>
							
								<TheButton
									variant="destructive"
									@click="onUpdate(modelValue.filter(v => v !== bundleItem))"
								>
									<TheIcon icon="delete" />
								</TheButton>
							</div>
						</template>

						<PrimaryButton class="col-span-12">
							{{ $t('button.create') }}
						</PrimaryButton>
					</BundleForm>
				</div>
			</template>
		</ThePopup>
	</section>
</template>
