<script setup lang="ts">
import type { Command } from "@/lib/utils";
import CommandCard from "../components/CommandCard.vue";

const $pt = usePageTranslate();

const commands = ref<Command[]>([]);
const page = ref(0);
const canSeeMore = ref(true);
const productSheetName = ref("");

function getCommands(page: number, push?: boolean) {
	return duploTo.enriched
		.get(
			"/commands",
			{
				query: { 
					page, 
					productSheetName: productSheetName.value 
				} 
			}
		)
		.info("userCommands", (data) => {
			if (data.length < 10) {
				canSeeMore.value = false;
			}
			if (push) {
				commands.value.push(...data);	
			}
			else {
				commands.value = data;
			}
		});
}

getCommands(page.value);

watch(
	productSheetName,
	() => {
		getCommands(page.value);
	}
);

</script>
<template>
	<section class="container flex flex-col gap-12 my-12 min-h-screen-nhm-mobile lg:min-h-screen-nhm-desktop lg:my-16">
		<h1 class="text-2xl font-bold lg:text-3xl">
			{{ $pt("title") }}
		</h1>

		<div>
			<PrimaryInput
				v-model="productSheetName"
				class="w-[200px]"
				:placeholder="$pt('searchPlaceholder')"
			/>
		</div>

		<CommandCard
			v-for="command in commands"
			:command="command"
			:key="command.id"
		/>

		<PrimaryButton
			v-if="canSeeMore"
			class="self-center"
			@click="getCommands(++page, true)"
		>
			Voir plus
		</PrimaryButton>

		<span
			v-else-if="!canSeeMore && commands.length === 0"
		>
			{{ $pt("noCommands") }}
		</span>
	</section>
</template>
