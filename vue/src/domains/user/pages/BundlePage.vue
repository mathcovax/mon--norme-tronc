<script setup lang="ts">
import type { Bundle, CarrierName,  } from "@/lib/utils";
import { useGetBundle } from "../composables/useGetBundle";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const params = useRouteParams({
	bundleId: zod.coerce.number()
});
const user = useUserStore();
const { bundle } = useGetBundle(params.value.bundleId);
const $pt = usePageTranslate();
const router = useRouter();
const { PRODUCT_PAGE } = routerPageName;
const currentTimeLine = ref(""); 

fetchEventSource(
	`/api/bundles/${params.value.bundleId}/stream`,
	{
		headers: {
			"access-token": user.accessToken ?? ""
		},
		onmessage(message) {
			currentTimeLine.value = message.data;
		},
	}
);

const cols: BigTableColDef<Bundle["bundleProducts"][number]>[] = [
	{
		title: $pt("table.image"),
		slotName: "image",
	},
	{
		title: $pt("table.name"),
		getter: i => i.name
	},
	{
		title: $pt("table.quantity"),
		getter: i => i.quantity
	},
];

const linkByCarrierNameMapper: Record<CarrierName, (value: string) => string> = {
	LA_POSTE: (value) => `https://www.laposte.fr/outils/suivre-vos-envois?code=${value}`
};

</script>

<template>
	<section
		v-if="bundle"
		class="flex flex-col items-center w-full gap-4 p-4 "
	>
		<div>
			<p>
				{{ $pt("transport") }} {{ $t(`carrierName.${bundle.carrierName}`) }}
			</p>

			<p>
				{{ $pt("idShip", {value: bundle.idShip}) }}
			</p>

			<p>
				{{ $pt("status") }} {{ $t(`bundleStatus.${bundle.status}`) }}
			</p>

			<p>
				{{ $pt("action", {value: currentTimeLine}) }}
			</p>

			<a
				:href="linkByCarrierNameMapper[bundle.carrierName](bundle.idShip)"
				class="underline"
			>
				{{ $pt("carrierSite") }}
			</a>
		</div>

		<div class="flex flex-col w-full">
			<p>{{ $pt("content") }}</p>

			<BigTable
				:items="bundle.bundleProducts"
				:cols="cols"
				@click-on-row="item => router.push({name: PRODUCT_PAGE, params: {productSheetId: item.productSheetId}})"
			>
				<template #image="{item}">
					<ProductImage
						:url="item.imageUrl"
						class="w-[150px]"
					/>
				</template>
			</BigTable>
		</div>
	</section>
</template>
