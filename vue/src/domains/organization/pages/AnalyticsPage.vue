<script setup lang="ts">
import { GridLayout } from "grid-layout-plus";
import { useGetGrid, type WidgetFull } from "@/domains/organization/composables/useGetGrid";
import TheTop from "@/domains/organization/components/TheTop.vue";
import TheValue from "@/domains/organization/components/TheValue.vue";
import { type WidgetParam, type WidgetStat, widgetType } from "@/lib/utils";
import { useWidgetAreaLineBarForm } from  "@/domains/organization/composables/useWidgetAreaLineBarForm";
import { useWidgetDonutPieForm } from "@/domains/organization/composables/useWidgetDonutPieForm";
import { useWidgetValueForm } from "@/domains/organization/composables/useWidgetValueForm";
import { useWidgetTopForm } from "@/domains/organization/composables/useWidgetTopForm";
import type ThePopup from "@/components/ThePopup.vue";
import { useOrganizationUserStore } from "@/domains/organization/stores/organizationUser";

const $pt = usePageTranslate();

const params = useRouteParams({ 
	organizationId: zod.string(), 
});

const { 
	gridStructure, 
	gridStat, 
	getGrid 
} = useGetGrid(params.value.organizationId);
const { 
	FormWidgetAreaLineBar, 
	checkFormWidgetAreaLineBar, 
	resetFormWidgetAreaLineBar, 
	toggleAreaLineBar,
	actionToggleAreaLineBar,
	suggestedCategories,
	getCategoriesWidgetAreaLineBar,
	suggestedFacets,
	getFacetsWidgetAreaLineBar,
	suggestedProductSheets,
	getProductSheetsWidgetAreaLineBar, 
} = useWidgetAreaLineBarForm(params.value.organizationId);
const { 
	FormWidgetDonutPie, 
	checkFormWidgetDonutPie, 
	resetFormWidgetDonutPie, 
	toggleDonutPie,
	actionToggleDonutPie,
} = useWidgetDonutPieForm(params.value.organizationId);
const { 
	FormWidgetValue, 
	checkFormWidgetValue, 
	resetFormWidgetValue,
	toggleValue, 
	actionToggleValue, 
} = useWidgetValueForm(params.value.organizationId);
const { 
	FormWidgetTop, 
	checkFormWidgetTop, 
	resetFormWidgetTop, 
	toggleTop,
	actionToggleTop,
	suggestedCategoriesTop,
	getCategoriesWidgetTop,
	suggestedProductSheetsTop,
	getProductSheetsWidgetTop,
} = useWidgetTopForm(params.value.organizationId);
const organizationUserStore = useOrganizationUserStore();

const popup = ref<InstanceType<typeof ThePopup>>();
const popupdelete = ref<InstanceType<typeof ThePopup>>();
const draggable = ref(true);
const resizable = ref(true);
const responsive = ref(true);
const chooseForm = ref<WidgetParam["type"] | undefined>();
const gridComp = ref(0);
const indexDelete = ref(0);

const reloadGrid = () => window.location.reload();

function openPopup(type: WidgetParam["type"]) {
	chooseForm.value = type;
	popup.value?.open();
}

function openPopupDelete(index: number) {
	popupdelete.value?.open();
	indexDelete.value = index;
}

function deleteWidget() {
	const lastGrid = reassignIndices();
	lastGrid.forEach((item) => {
		if (item.i === indexDelete.value) {
			lastGrid.splice(indexDelete.value, 1);
		}
	});

	duploTo.enriched
		.put(
			"/organizations/{organizationId}/grid",
			lastGrid,
			{ params: { organizationId: params.value.organizationId } }
		)
		.info("gridStatCommand.updated", async () => {
			await getGrid();
			popupdelete.value?.close();
			reloadGrid();
		});
}

function saveLayout(layout: WidgetFull[]) {
	const layoutData = JSON.stringify(layout);
	localStorage.setItem("myLayout", layoutData);
}

function updatePosition(layout: WidgetFull[]) {
	return duploTo.enriched
		.put(
			"/organizations/{organizationId}/grid",
			layout,
			{ params: { organizationId: params.value.organizationId } }
		)
		.result;
}

function reassignIndices() {
	const lastGrid = gridStructure.value;
	lastGrid.forEach((item, index) => {
		item.i = index;
	});

	return lastGrid;
}

async function submitLineAreaBar() {
	if (chooseForm.value !== "line" && chooseForm.value !== "area" && chooseForm.value !== "bar") return;
	const formFields = await checkFormWidgetAreaLineBar();
	if (!formFields) return;
	let areaLineBar: WidgetStat | null = null;

	if (formFields.category !== undefined && formFields.category.length !== 0) {
		areaLineBar = {
			x: 0,
			y: 0,
			w: 6,
			h: 3,
			i: gridStructure.value.length,
			params: {
				type: chooseForm.value,
				filters: {
					categories: formFields.category.map((i) => i.value),
					facets: {},
					startDate: new Date(formFields.startDate),
					endDate: new Date(formFields.endDate),
				}
			}
		};
	} else if (formFields.productSheet !== undefined && formFields.productSheet.length !== 0) {
		areaLineBar = {
			x: 0,
			y: 0,
			w: 6,
			h: 3,
			i: gridStructure.value.length,
			params: {
				type: chooseForm.value,
				filters: {
					productSheetsId: formFields.productSheet.map((i) => i.value),
					startDate: new Date(formFields.startDate),
					endDate: new Date(formFields.endDate),
				}
			}
		};
	}
	if (areaLineBar === null) return;
	
	const lastGrid = reassignIndices();
	lastGrid.push(areaLineBar);

	duploTo.enriched
		.put(
			"/organizations/{organizationId}/grid",
			lastGrid,
			{ params: { organizationId: params.value.organizationId } }
		)
		.info("gridStatCommand.updated", async () => {
			resetFormWidgetAreaLineBar();
			await getGrid();
			popup.value?.close();
			reloadGrid();
		});
}

async function submitValue() {
	if (chooseForm.value !== "value") return;
	const formFields = await checkFormWidgetValue();
	if (!formFields) return;

	const value: WidgetStat = {
		x: 0,
		y: 0,
		w: 3,
		h: 1,
		i: gridStructure.value.length,
		params: {
			type: "value",
			filters: {
				customfilterType: formFields.productSheet === undefined || formFields.productSheet.length === 0 ? 
					"category" : 
					"productSheetId",
				filterValue: formFields.productSheet === undefined || formFields.productSheet.length === 0 ? 
					formFields.category === undefined ? "" : formFields.category : 
					formFields.productSheet,
				startDate: new Date(formFields.startDate),
				endDate: new Date(formFields.endDate),	
			}
		}
	};

	const lastGrid = reassignIndices();
	lastGrid.push(value);

	duploTo.enriched
		.put(
			"/organizations/{organizationId}/grid",
			lastGrid,
			{ params: { organizationId: params.value.organizationId } }
		)
		.info("gridStatCommand.updated", async () => {
			resetFormWidgetValue();
			await getGrid();
			popup.value?.close();
			reloadGrid();
		});
}

async function submitDonutPie() {
	if (chooseForm.value !== "donut" && chooseForm.value !== "pie") return;
	const formFields = await checkFormWidgetDonutPie();
	if (!formFields) return;
	let donutPie: WidgetStat | null = null;

	if (formFields.category !== undefined && formFields.category.length !== 0) {
		donutPie = {
			x: 0,
			y: 0,
			w: 2,
			h: 1,
			i: gridStructure.value.length,
			params: {
				type: chooseForm.value,
				filters: {
					categories: [formFields.category],
					facets: {},
					startDate: new Date(formFields.startDate),
					endDate: new Date(formFields.endDate),
				}
			}
		};
	} else if (formFields.productSheet !== undefined && formFields.productSheet.length !== 0) {
		donutPie = {
			x: 0,
			y: 0,
			w: 2,
			h: 1,
			i: gridStructure.value.length,
			params: {
				type: chooseForm.value,
				filters: {
					productSheetsId: [formFields.productSheet],
					startDate: new Date(formFields.startDate),
					endDate: new Date(formFields.endDate),
				}
			}
		};
	}
	if (donutPie === null) return;

	const lastGrid = reassignIndices();
	lastGrid.push(donutPie);

	duploTo.enriched
		.put(
			"/organizations/{organizationId}/grid",
			lastGrid,
			{ params: { organizationId: params.value.organizationId } }
		)
		.info("gridStatCommand.updated", async () => {
			resetFormWidgetDonutPie();
			await getGrid();
			popup.value?.close();
			reloadGrid();
		});
}

async function submitTop() {
	if (chooseForm.value !== "top") return;
	const formFields = await checkFormWidgetTop();
	if (!formFields) return;

	const top: WidgetStat = {
		x: 0,
		y: 0,
		w: 4,
		h: 3,
		i: gridStructure.value.length,
		params: {
			type: "top",
			filters: {
				customfilterType: formFields.productSheet === undefined || formFields.productSheet.length === 0 ? 
					"categories" : 
					"productSheetsId",
				filterValue: formFields.productSheet === undefined || formFields.productSheet.length === 0 ? 
					formFields.category === undefined ? [] : formFields.category.map((i) => i.value) : 
					formFields.productSheet.map((i) => i.value),
				startDate: new Date(formFields.startDate),
				endDate: new Date(formFields.endDate),	
			}
		}
	};

	const lastGrid = reassignIndices();
	lastGrid.push(top);

	duploTo.enriched
		.put(
			"/organizations/{organizationId}/grid",
			lastGrid,
			{ params: { organizationId: params.value.organizationId } }
		)
		.info("gridStatCommand.updated", async () => {
			resetFormWidgetTop();
			await getGrid();
			popup.value?.close();
			reloadGrid();
		});
}

onMounted(async () => {
	await getGrid();
	if (gridStat.value.length > 0) {
		saveLayout(gridStat.value);
	}
});
</script>

<template>
	<section>
		<h1 class="mb-12 text-3xl font-bold">
			{{ $pt("title") }}
		</h1>

		<div class="flex flex-row justify-between">
			<div
				class="flex items-center"
				v-if="organizationUserStore.hasRole('OWNER')"
			>
				<PrimarySelect
					class="max-w-[300px]"
					:items="widgetType.map(type => ({ label: $pt(`graphic.${type}`), value: type }))"
					:placeholder="$pt('select.add')"
					@update:model-value="value => openPopup(value as WidgetParam['type'])"
				/>

				<PrimaryButton
					class="ml-4 px-3 py-2 rounded-lg border cursor-pointer"
					@click="updatePosition(gridStat)"
				>
					{{ $pt("button.save") }}
				</PrimaryButton>
			</div>

			<TheIcon
				class="ml-4 px-3 py-2 rounded-lg border cursor-pointer"
				icon="reload"
				@click="reloadGrid"
			/>
		</div>

		<ThePopup
			ref="popup"
			class="max-w-[700px] w-[80%]"
		>
			<template #popupContent>
				<h1 class="font-bold text-xl mt-2 mb-8">
					{{ $pt('form.title') + chooseForm?.toUpperCase() }}
				</h1>

				<FormWidgetDonutPie
					v-if="chooseForm === 'donut' || chooseForm === 'pie'"
					@submit="submitDonutPie"
				>
					<TheToggle
						:label="['category', 'productSheet']"
						:state="toggleDonutPie"
						@click="actionToggleDonutPie"
					/>

					<PrimaryButton
						type="submit"
						class="col-span-12"
					>
						{{ $t("button.save") }}
					</PrimaryButton>
				</FormWidgetDonutPie>

				<FormWidgetAreaLineBar
					v-else-if="chooseForm === 'area' || chooseForm === 'line' || chooseForm === 'bar'"
					@submit="submitLineAreaBar"
				>
					<TheToggle
						:label="['categories', 'productSheets']"
						:state="toggleAreaLineBar"
						@click="actionToggleAreaLineBar"
					/>
					
					<template 
						#category="{onUpdate, modelValue}"
						v-if="!toggleAreaLineBar"
					>
						<MultiComboBox
							:model-value="modelValue"
							@update:model-value="onUpdate"
							:items="suggestedCategories.map((i) => ({ label: i.name, value: i.name }))"
							@update:search-term="getCategoriesWidgetAreaLineBar"
							:placeholder="$pt('form.placeholder.category')"
							:empty-label="$t('form.label.category')"
						/>
					</template>

					<template 
						#facets="{onUpdate, modelValue}"
						v-if="false"
					>
						<MultiComboBox
							:model-value="modelValue"
							@update:model-value="onUpdate"
							:items="suggestedFacets.map((i) => ({ label: i.value, value: i.value }))"
							@update:search-term="getFacetsWidgetAreaLineBar"
							:placeholder="$pt('form.placeholder.facet')"
							:empty-label="$t('form.label.facet')"
						/>
					</template>

					<template 
						#productSheet="{onUpdate, modelValue}"
						v-if="toggleAreaLineBar"
					>
						<MultiComboBox
							:model-value="modelValue"
							@update:model-value="onUpdate"
							:items="suggestedProductSheets.map((i) => ({ label: i.name, value: i.name }))"
							@update:search-term="getProductSheetsWidgetAreaLineBar"
							:placeholder="$pt('form.placeholder.productSheet')"
							:empty-label="$t('form.label.productSheet')"
						/>
					</template>

					<PrimaryButton
						type="submit"
						class="col-span-12"
					>
						{{ $t("button.save") }}
					</PrimaryButton>
				</FormWidgetAreaLineBar>

				<FormWidgetValue
					v-else-if="chooseForm === 'value'"
					@submit="submitValue"
				>
					<TheToggle
						:label="['category', 'productSheet']"
						:state="toggleValue"
						@click="actionToggleValue"
					/>

					<PrimaryButton
						type="submit"
						class="col-span-12"
					>
						{{ $t("button.save") }}
					</PrimaryButton>
				</FormWidgetValue>

				<FormWidgetTop
					v-else-if="chooseForm === 'top'"
					@submit="submitTop"
				>
					<TheToggle
						:label="['categories', 'productSheets']"
						:state="toggleTop"
						:action="actionToggleTop"
					/>

					<template 
						#category="{onUpdate, modelValue}" 
						v-if="!toggleTop"
					>
						<MultiComboBox
							:model-value="modelValue"
							@update:model-value="onUpdate"
							:items="suggestedCategoriesTop.map((i) => ({ label: i.name, value: i.name }))"
							@update:search-term="getCategoriesWidgetTop"
							:placeholder="$pt('form.placeholder.category')"
							:empty-label="$t('form.label.category')"
						/>
					</template>

					<template 
						#productSheet="{onUpdate, modelValue}"
						v-if="toggleTop"
					>
						<MultiComboBox
							:model-value="modelValue"
							@update:model-value="onUpdate"
							:items="suggestedProductSheetsTop.map((i) => ({ label: i.name, value: i.name }))"
							@update:search-term="getProductSheetsWidgetTop"
							:placeholder="$pt('form.placeholder.productSheet')"
							:empty-label="$t('form.label.productSheet')"
						/>
					</template>

					<PrimaryButton
						type="submit"
						class="col-span-12"
					>
						{{ $t("button.save") }}
					</PrimaryButton>
				</FormWidgetTop>
			</template>
		</ThePopup>

		<ThePopup
			ref="popupdelete"
			class="max-w-[700px] w-[80%]"
		>
			<template #popupContent>
				<div class="flex flex-row items-center justify-center space-x-8 my-2">
					<h1>{{ $pt("text.deleteWidget") }}</h1>

					<PrimaryButton
						type="submit"
						class="col-span-12"
						@click="deleteWidget()"
					>
						{{ $t("button.delete") }}
					</PrimaryButton>
				</div>
			</template>
		</ThePopup>

		<div 
			class="w-full overflow-hidden relative"
			v-if="gridStat.length > 0"
		>
			<GridLayout
				:key="gridComp"
				v-model:layout="gridStat"
				:is-draggable="draggable"
				:is-resizable="resizable"
				:responsive="responsive"
				@layout-updated="saveLayout"
			>
				<template #item="{ item }">
					<div 
						class="w-full h-full p-4 flex justify-center items-center bg-white border duration-500 active:scale-[0.6] active:bg-white py-3 px-8 font-semibold touch-manipulation relative after:content-[''] after:bg-black after:w-full after:-z-10 after:absolute after:h-full after:top-1 after:left-1 after:duration-300 after:rounded-lg rounded-lg hover:after:top-0 hover:after:left-0 hover:after:bg-transparent"
						@contextmenu="openPopupDelete(item.i)"
					>
						<TheTop
							v-if="item.params.type === 'top'"
							:value="item.data"
							:title="$pt('text.top')"
						/>

						<TheValue
							v-if="item.params.type === 'value'"
							:data="item.data.length > 0 ? item.data[0] : { total: 0, key: '' }"
						/>

						<AreaChart
							v-if="item.params.type === 'area'"
							:data="item.data"
							index="name"
							:categories="item.categories.map((i: any) => i.name)"
						/>

						<LineChart
							v-if="item.params.type === 'line'"
							:data="item.data"
							index="name"
							:categories="item.categories.map((i: any) => i.name)"
							:y-formatter="(tick, i) => {
								return typeof tick === 'number'
									? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
									: ''
							}"
						/>

						<BarChart
							v-if="item.params.type === 'bar'"
							:data="item.data"
							index="name"
							:categories="item.categories.map((i: any) => i.name)"
							:y-formatter="(tick, i) => {
								return typeof tick === 'number'
									? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
									: ''
							}"
						/>

						<div
							v-if="item.params.type === 'pie' || item.params.type === 'donut'"
							class="w-full h-full flex flex-col items-center"
						>
							<p>
								{{ item.categories.name }}
							</p>

							<DonutChart
								v-if="item.params.type === 'donut'"
								index="name"
								:category="item.categories.name"
								:data="item.data"
								:type="'donut'"
								class="w-full h-full"
							/>

							<DonutChart
								v-if="item.params.type === 'pie'"
								index="name"
								:category="item.categories.name"
								:data="item.data"
								:type="'pie'"
								class="w-full h-full"
							/>
						</div>
					</div>
				</template>
			</GridLayout>
		</div>

		<div 
			class="w-full h-full flex justify-center items-center"
			v-else
		>
			<p>{{ $pt("text.noData") }}</p>
		</div>
	</section>
</template>

<style scoped>
.vgl-layout {
	--vgl-placeholder-bg: rgb(105, 105, 105);
	border-radius: var(--radius);

}

:deep(.vgl-item:not(.vgl-item--placeholder)) {
	background-color: transparent;
	border: 1px solid black;
	border-radius: var(--radius);
}

:deep(.vgl-item--resizing) {
	opacity: 90%;
}

:deep(.vgl-item__resizer) {
	margin: 0.2rem;
}
</style>
