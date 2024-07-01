<script setup lang="ts">
import type { Promotion } from "@/lib/utils";
import { useGetOrganizationPromotions } from "../composables/useGetOrganizationPromotions";
import { usePromotionAddForm } from "../composables/usePromotionAddForm";

const $pt = usePageTranslate();
const params = useRouteParams({ organizationId: zod.string() });

const { promotions, getOrganizationPromotions } = useGetOrganizationPromotions(params.value.organizationId);

const {
	FormPromotionAdd,
	checkFormPromotionAdd,
	resetFormPromotionAdd
} = usePromotionAddForm(params.value.organizationId);

const currentPage = ref(0);
const cols: BigTableColDef<Promotion>[] = [
	{
		title: $pt("table.col.productSheetName"),
		getter: i => i.productSheetName
	},
	{
		title: $pt("table.col.percentage"),
		getter: i => $pt("table.percentage", { value: i.percentage }),
	},
	{
		title: $pt("table.col.startDate"),
		getter: i => i.startDate?.split("T")[0] ?? "",
	},
	{
		title: $pt("table.col.endDate"),
		getter: i => i.endDate?.split("T")[0] ?? "",
	},
	{
		title: $pt("table.col.actions"),
		slotName: "actions",
		cols: 2,
	}
];

function next() {
	if (promotions.value.length < 10) {
		return;
	}

	getOrganizationPromotions(currentPage.value += 1);
}

function previous() {
	if (currentPage.value === 0) {
		return;
	}

	getOrganizationPromotions(currentPage.value -= 1);
}

async function submit() {
	const formFields = await checkFormPromotionAdd();

	if (!formFields) {
		return;
	}

	duploTo.enriched
		.post(
			"/product-sheet/{productSheetId}/promotions",
			{
				percentage: formFields.percentage,
				startDate: formFields.startDate,
				endDate: formFields.endDate,
			},
			{ params: { productSheetId: formFields.productSheet } }
		)
		.info("promotion.created", () => {
			resetFormPromotionAdd();
			getOrganizationPromotions(currentPage.value);
		});
}

function deletePromotion(promotion: Promotion) {
	duploTo.enriched
		.delete(
			"/promotions/{promotionId}",
			{ params: { promotionId: promotion.id } }		
		)	
		.info("promotion.deleted", () => {
			getOrganizationPromotions(currentPage.value);
		});
}
</script>
<template>
	<section>
		<h1 class="mb-12 text-2xl font-semibold">
			{{ $pt("title") }}
		</h1>

		<div 
			class="flex flex-col items-center w-full gap-6 p-6"
		>
			<h2 class="text-xl font-semibold">
				{{ $pt("form.title") }}
			</h2>

			<FormPromotionAdd
				@submit="submit"
				class="max-w-[500px] w-[80%]"
			>
				<PrimaryButton
					type="submit"
					class="col-span-12"
				>
					{{ $t("button.validate") }}
				</PrimaryButton>
			</FormPromotionAdd>

			<BigTable
				:items="promotions"
				:cols="cols"
				:current-page="currentPage + 1"
				:action-label="$pt('table.col.actions')"
				@click-next="next"
				@click-previous="previous"
			>
				<template #actions="{item}">
					<WithValidation
						:title="$pt('popup.title')"
						:content="$pt('popup.content')"
						class="col-span-4"
						@validate="deletePromotion(item)"
					>
						<SecondaryButton>
							<TheIcon icon="delete" />
						</SecondaryButton>
					</WithValidation>
				</template>
			</BigTable>
		</div>
	</section>
</template>
