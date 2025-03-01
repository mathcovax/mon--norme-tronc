<script setup lang="ts">
import type { BundleCollection, FullCommand } from "@/lib/utils";
import BundleCard from "../components/BundleCard.vue";
import ProductCommand from "../components/ProductCommand.vue";

const $pt = usePageTranslate();

const params = useRouteParams({ 
	commandId: zod.string(), 
});
const router = useRouter();
const { USER_COMMANDS } = routerPageName;
const command = ref<FullCommand | null>(null);
const bundles = ref<BundleCollection>([]);

function getCommandBundles() {
	return duploTo.enriched
		.get(
			"/commands/{commandId}/bundles",
			{ params: { commandId: params.value.commandId } }
		)
		.info("bundles.found", (data) => {
			bundles.value = data;
		})
		.result;
}

function getCommandData() {
	return duploTo.enriched
		.get(
			"/commands/{commandId}",
			{ params: { commandId: params.value.commandId } }
		)
		.info("command.found", (data) => {
			command.value = data;
		})
		.e(() => {
			router.push({ name: USER_COMMANDS });
		})
		.result;
}

getCommandData();
getCommandBundles();

watch(() => params.value.commandId, () => { getCommandData(), getCommandBundles(); });

function redirectToInvoiceUrl() {
	return duploTo.enriched
		.get(
			"/commands/{commandId}/invoice",
			{
				params: { commandId: params.value.commandId }
			}
		)
		.info("command.invoice", data => {
			location.href = data;
		})
		.result;
}

</script>
<template>
	<section
		v-if="command"
		class="container flex flex-col gap-6 my-12 min-h-screen-nhm-mobile lg:min-h-screen-nhm-desktop lg:my-16"
	>
		<div>
			<div class="flex flex-col gap-2 p-2">
				<RouterLink
					:to="{ name: USER_COMMANDS }"
					class="flex items-center gap-1 mb-6 text-center"
				>
					<TheIcon
						icon="arrow-left"
						size="2xl"
					/>

					<span>{{ $pt("returnBack") }}</span>
				</RouterLink>

				<h1 class="text-2xl font-bold lg:text-3xl">
					{{ $pt("title") }}
				</h1>

				<div class="flex justify-between">
					<div class="flex gap-2">
						<span>{{ $pt("command.label.date", { value: command.createdDate.toString().split("T")[0] }) }}</span>

						<span class="text-gray-300">|</span>

						<span>{{ $pt("command.label.commandNumber", { value: command.id }) }}</span>
					</div>

					<PrimaryButton
						@click="redirectToInvoiceUrl"
						
						class="flex items-center gap-2"
					>
						{{ $pt("command.seeInvoice") }}
					</PrimaryButton>
				</div>
			</div>

			<TheCard>
				<CardContent class="flex justify-between p-4">
					<div class="flex flex-col gap-2">
						<span class="font-bold">{{ $pt("command.deliveryAddress") }}</span>

						<div class="flex flex-col">
							<span>{{ command.lastname + " " + command?.firstname }}</span>

							<span>{{ command.deliveryAddress }}</span>
						</div>
					</div>

					<div class="flex flex-col gap-2">
						<span class="font-bold">{{ $pt("command.recapCommand") }}</span>

						<div class="flex flex-col">
							<span>{{ $pt("command.boughtProducts", { value: command.items.length }) }}</span>

							<span>{{ $t(`commandStatus.${command?.status}`) }}</span>

							<span class="font-bold">{{ $pt("command.totalPrice", { value: command.price }) }}</span>
						</div>
					</div>
				</CardContent>
			</TheCard>
		</div>

		<h1
			class="text-xl font-bold lg:text-2xl"
		>
			{{ $pt("product.title") }}
		</h1>

		<TheCard>
			<CardContent class="flex flex-col gap-8 p-4">
				<ProductCommand
					v-for="product in command.items"
					:product="product"
					:key="product.productSheetId"
				/>
			</CardContent>
		</TheCard>

		<h1
			class="text-xl font-bold lg:text-2xl"
		>
			{{ $pt("bundle.title") }}
		</h1>

		<TheCard>
			<CardContent class="flex flex-col gap-8 p-4">
				<BundleCard
					v-for="bundle in bundles"
					:bundle="bundle"
					:key="bundle.id"
				/>
			</CardContent>
		</TheCard>
	</section>
</template>
