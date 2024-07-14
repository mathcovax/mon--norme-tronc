<script setup lang="ts">
import type { ProductReturn } from "@/lib/utils";
import { useGetProductReturn } from "../composables/useGetProductReturn";
import { useProductReturnForm } from "../composables/useProductReturnForm";
import { useGetProductCommandStory } from "../composables/useGetProductCommandStory";
import type ThePopup from "@/components/ThePopup.vue";

const params = useRouteParams({
	organizationId: zod.string(),
});
const {
	productReturns, 
	productReturnsQuery,
	refreshProductReturns,
} = useGetProductReturn(params.value.organizationId);
const { 
	ProductReturnForm, 
	productReturnValues, 
	resetProductReturnForm, 
	checkProductReturnForm 
} = useProductReturnForm(params.value.organizationId);
const { getProductCommandStory, productCommandsStory } = useGetProductCommandStory();
const $pt = usePageTranslate();

const cols: BigTableColDef<ProductReturn>[] = [
	{
		title: $t("label.sku"),
		getter: i => i.productSku,
	},
	{
		title: $t("label.status"),
		getter: i => $t(`productReturnStatus.${i.status}`),
	},
	{
		title: $t("label.createdAt"),
		getter: i => i.createdAt?.split("T")[0],
	},
]; 

function next() {
	if (productReturns.value.length < 10) {
		return;
	}
	productReturnsQuery.value.page = (productReturnsQuery.value.page ?? 0) + 1;
}

function previous() {
	if (!productReturnsQuery.value.page) {
		return;
	}
	productReturnsQuery.value.page--;
}

watch(
	productReturnValues.sku,
	() => {
		if (!productReturnValues.sku.value) {
			productCommandsStory.value = [];
		}
		else {
			getProductCommandStory(productReturnValues.sku.value.identifier.toString());
		}
		
	}
);

const popup = ref<InstanceType<typeof ThePopup>>();

async function createRefund() {
	const formField = await checkProductReturnForm();

	if (!formField) {
		return;
	}

	duploTo.enriched
		.post(
			"/organization/{organizationId}/product-returns",
			{
				sku: formField.sku,
				reason: formField.reason,
			},
			{
				params: { organizationId: params.value.organizationId }
			}
		)
		.info("productReturn.created", () => {
			refreshProductReturns();
			popup.value?.close();
		});
}

const refundPopup = ref<InstanceType<typeof ThePopup>>();
const currentProductReturn = ref<ProductReturn| undefined>();
function openRefundPopup(productReturn: ProductReturn) {
	currentProductReturn.value = productReturn;
	refundPopup.value?.open();
}

function refund(productReturnId: number) {
	duploTo.enriched
		.post(
			"/product-returns/{productReturnId}/refound",
			undefined,
			{
				params: { productReturnId }
			}
		)
		.info("product.refound", () => {
			refreshProductReturns();
			refundPopup.value?.close();
		});
}

function patch(productReturn: ProductReturn) {
	duploTo.enriched
		.patch(
			"/product-returns/{productReturnId}",
			{
				productReturnStatus: productReturn.status === "WAITING_RETURN" 
					? "INVALID" 
					: "WAITING_RETURN"
			},
			{
				params: { productReturnId: productReturn.id }
			}
		)
		.info("productReturn.edited", () => {
			refreshProductReturns();
			refundPopup.value?.close();
		});
}

</script>

<template>
	<section class="flex flex-col items-center gap-4">
		<div class="flex gap-4">
			<PrimaryInput
				v-model="productReturnsQuery.sku"
				:placeholder="$t('placeholder.search')"
			/>

			<ThePopup
				class="min-w-[500px] max-w-[90%] max-h-[90%] overflow-auto"
				ref="popup"
			>
				<template #trigger="{open}">
					<PrimaryButton @click="resetProductReturnForm(); open()">
						{{ $t("button.create") }}
					</PrimaryButton>
				</template>

				<template #popupContent>
					<ProductReturnForm />

					<div
						v-for="fullCommand of productCommandsStory"
						:key="fullCommand.id"
						class="w-full text-center"
					>
						<p>{{ fullCommand.lastname }} {{ fullCommand.firstname }}</p>

						<p>{{ fullCommand.deliveryAddress }}</p>

						<p>{{ fullCommand.status }}</p>

						<p>{{ fullCommand.id }}</p>

						<p>{{ fullCommand.createdDate.toString().split("T")[0] }}</p>
					</div>

					<PrimaryButton @click="createRefund">
						{{ $t("button.create") }}
					</PrimaryButton>
				</template>
			</ThePopup>
		</div>
		
		<BigTable 
			:items="productReturns"
			:cols="cols"
			:current-page="(productReturnsQuery.page ?? 0) + 1"
			@click-next="next"
			@click-previous="previous"
			@click-on-row="pr => openRefundPopup(pr)"
		/>

		<ThePopup
			ref="refundPopup"
			class="min-w-[500px] max-w-[90%] max-h-[90%] overflow-auto"
		>
			<template #popupContent>
				<div v-if="currentProductReturn">
					<p>{{ $t("label.sku") }} : {{ currentProductReturn.productSku }}</p>

					<p>{{ $pt("label.reason") }} :  {{ currentProductReturn.reason }}</p>

					<p>{{ $t("label.status") }} : {{ $t(`productReturnStatus.${currentProductReturn.status}`) }}</p>

					<div
						class="flex gap-4 mt-4"
						v-if="currentProductReturn.status != 'REFUNDED'"
					>
						<PrimaryButton @click="refund(currentProductReturn.id)">
							{{ $pt("button.refund") }}
						</PrimaryButton>

						<SecondaryButton @click="patch(currentProductReturn)">
							{{ $pt(currentProductReturn.status === "WAITING_RETURN" ? "button.invalid" : "button.putInWaiting") }}
						</SecondaryButton>
					</div>
				</div>
			</template>
		</ThePopup>
	</section>
</template>
