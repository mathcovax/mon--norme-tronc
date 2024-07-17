<script setup lang="ts">
import { useGetProducts } from "../composables/useGetProducts";
import type { FullProductSheet, Product, ProductStatus } from "@/lib/utils";
import { useProductForm } from "../composables/useProductForm";
import WithValidation from "@/components/WithValidation.vue";
import { useGetFullProductSheet } from "../composables/useGetFullProductSheet";
import type ThePopup from "@/components/ThePopup.vue";

const params = useRouteParams({ 
	organizationId: zod.string(), 
});
const { products, getProducts } = useGetProducts(params.value.organizationId);
const { ProductForm, checkProductForm, resetProductForm } = useProductForm();
const { fullProductSheet, fullProductSheetQuery } = useGetFullProductSheet(params.value.organizationId);
const currentPage = ref(0);
const searchRef = ref("");
const $pt = usePageTranslate();
const statusToColor: Record<ProductStatus, string> = {
	WRONG: "red",
	SOLD: "green",
	IN_STOCK: "purple",
};

const colsFullProductSheet: BigTableColDef<FullProductSheet>[] = [
	{
		title: "",
		slotName: "image"
	},
	{
		title: $pt("table.ref"),
		getter: i => i.ref,
	},
	{
		title: $pt("table.name"),
		getter: i => i.name,
	},
	{
		title: $pt("table.quantity"),
		getter: i => i.quantity,
	},
];

const cols: BigTableColDef<Product>[] = [
	{
		title: $pt("table.sku"),
		getter: i => i.sku
	},
	{
		title: $pt("table.warehouseName"),
		getter: i => i.warehouseName
	},
	{
		title: $pt("table.lastEdit"),
		getter: i => i.updatedAt.split("T")[0]
	},
	{
		title: $pt("table.status"),
		slotName: "status"
	},
	{
		title: $t("label.actions"),
		slotName: "actions"
	},
];

function nextFullproductSheet() {
	if (fullProductSheet.value.length < 10) {
		return;
	}

	fullProductSheetQuery.value.page = (fullProductSheetQuery.value?.page ?? 0) + 1;
}

function previousFullproductSheet() {
	if (!fullProductSheetQuery.value.page || fullProductSheetQuery.value.page === 0) {
		return;
	}
	fullProductSheetQuery.value.page--;
}

function next() {
	if (products.value.length < 10) {
		return;
	}
	getProducts({ 
		page: ++currentPage.value, 
		productSheetId: currentFullProductSheet.value?.id 
	});
}

function previous() {
	if (currentPage.value === 0) {
		return;
	}
	getProducts({ 
		page: --currentPage.value, 
		productSheetId: currentFullProductSheet.value?.id 
	});
}

async function submitPost() {
	const formFields = await checkProductForm();

	if (!formFields || !currentFullProductSheet.value) return;

	await duploTo.enriched
		.post(
			"/product-sheet/{productSheetId}/product",
			{ sku: formFields.sku, },
			{ params: { productSheetId: currentFullProductSheet.value.id } }
		)
		.info("product.created", () => {
			resetProductForm();
			getProducts({ 
				page: currentPage.value, 
				productSheetId: currentFullProductSheet.value?.id 
			});
		});
}

async function toggleStatus(product: Product) {
	if (product.status !== "WRONG" && product.status !== "IN_STOCK") return;
	await duploTo.enriched
		.patch(
			"/product/{sku}",
			{
				status: product.status === "WRONG" ? "IN_STOCK" : "WRONG"
			},
			{ params: { sku: product.sku } }
		)
		.info("product.edited", () => {
			resetProductForm();
			getProducts({ 
				page: currentPage.value, 
				productSheetId: currentFullProductSheet.value?.id 
			});
		});
}

watch(
	searchRef, 
	() => {
		fullProductSheetQuery.value.ref = searchRef.value;
	}
);

const popup = ref<typeof ThePopup>();
const currentFullProductSheet = ref<FullProductSheet>();
function openPopup(fullProductSheet: FullProductSheet) {
	currentFullProductSheet.value = fullProductSheet;
	getProducts();
	popup.value?.open();
}
</script>

<template>
	<section>
		<h1 class="mb-12 text-2xl font-semibold">
			{{ $pt("title") }}
		</h1>

		<div class="flex flex-col items-center w-full gap-6 p-6">
			<div class="flex justify-center w-full gap-[1rem]">
				<PrimaryInput
					class="max-w-[300px]"
					:placeholder="$pt('searchPlaceholder')"
					v-model="searchRef"
				/>
			</div>

			<BigTable
				:items="fullProductSheet"
				:cols="colsFullProductSheet"
				:current-page="currentPage + 1"
				@click-next="nextFullproductSheet"
				@click-previous="previousFullproductSheet"
				@click-on-row="i => openPopup(i)"
			>
				<template #image="{item}">
					<ProductImage
						class="w-[50px]"
						:url="item.images[0]"
					/>
				</template>
			</BigTable>
		</div>

		<ThePopup
			ref="popup"
			class="max-h-[90%] overflow-auto"
		>
			<template #popupContent>
				<div class="w-full flex flex-col items-center p-6 gap-6">
					<h2 class="text-xl font-semibold">
						{{ $pt("form.title") }}
					</h2>

					<ProductForm
						@submit="submitPost"
						class="max-w-[500px] w-[80%]"
					>
						<PrimaryButton
							type="submit"
							class="col-span-12"
						>
							{{ $t("button.create") }}
						</PrimaryButton>
					</ProductForm>

					{{ $pt("table.quantity") }} : {{ currentFullProductSheet?.quantity }}
				</div>
			
				<BigTable
					:items="products"
					:cols="cols"
					:current-page="currentPage + 1"
					@click-next="next"
					@click-previous="previous"
				>
					<template #status="{item}">
						<TheSheep
							:text="$t(`productStatus.${item.status}`)"
							:color="statusToColor[item.status]"
						/>
					</template>

					<template #actions="{item}">
						<WithValidation
							:title="$pt('popupWrongMessage')"
							@validate="toggleStatus(item)"
							:disabled="item.status !== 'WRONG' && item.status !== 'IN_STOCK'"
						>
							<SecondaryButton>
								<TheIcon icon="square-edit-outline" />
							</SecondaryButton>
						</WithValidation>
					</template>
				</BigTable>
			</template>
		</ThePopup>
	</section>
</template>
