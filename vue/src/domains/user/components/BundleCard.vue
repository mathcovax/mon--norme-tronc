<script setup lang="ts">
import type { BundleCollection } from "@/lib/utils";

const { USER_BUNDLE } = routerPageName;

interface Props {
	bundle: BundleCollection[number];
}

defineProps<Props>();
const $pt = usePageTranslate();

</script>
<template>
	<RouterLink
		:to="{ name: USER_BUNDLE, params: { bundleId: bundle.id } }"
	>
		<h1>{{ $pt("bundle.id", {id: bundle.id}) }}</h1>
		
		<p>{{ $pt("bundle.carrierName") }} {{ $t(`carrierName.${bundle.carrierName}`) }}</p>

		<p>{{ $pt("bundle.status") }} {{ $t(`bundleStatus.${bundle.status}`) }}</p>

		<p>{{ $pt("bundle.productsCount", {value: bundle.productsCount}) }}</p>
	</RouterLink>
</template>
