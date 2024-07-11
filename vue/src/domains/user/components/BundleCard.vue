<script setup lang="ts">
import type { BundleCollection } from "@/lib/utils";

const { USER_BUNDLE } = routerPageName;

interface Props {
	bundle: BundleCollection[number];
}

defineProps<Props>();

</script>
<template>
	<RouterLink
		:to="{ name: USER_BUNDLE, params: { bundleId: bundle.id } }"
	>
		<h1>Paquet n°{{ bundle.id }}</h1>
		
		<p>Nom du transporteur : {{ $t(`carrierName.${bundle.carrierName}`) }}</p>

		<p>Status : {{ $t(`bundleStatus.${bundle.status}`) }}</p>

		<p>Nombre de produit dans le paquet : {{ bundle.productsCount }}</p>
	</RouterLink>
</template>
