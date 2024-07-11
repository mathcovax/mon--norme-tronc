<script setup lang="ts">
import { Command } from "@/lib/utils";
import CommandCard from "../components/CommandCard.vue";

const $pt = usePageTranslate();

const commands = ref<Command[]>([]);
const page = ref(0);
const canSeeMore = ref(true);

function getCommands(page: number) {
	return duploTo.enriched
		.get(
			"/commands",
			{ query: { page } }
		)
		.info("userCommands", (data) => {
			if (data.length < 2) {
				canSeeMore.value = false;
			}
			commands.value.push(...data);	
		});
}

getCommands(page.value);

</script>
<template>
	<section class="container flex flex-col gap-12 my-12 min-h-screen-nhm-mobile lg:min-h-screen-nhm-desktop lg:my-16">
		<h1 class="text-2xl font-bold lg:text-3xl">
			{{ $pt("title") }}
		</h1>

		<CommandCard
			v-for="command in commands"
			:command="command"
			:key="command.id"
		/>

		<PrimaryButton
			v-if="canSeeMore"
			class="self-center"
			@click="getCommands(++page)"
		>
			Voir plus
		</PrimaryButton>

		<span
			v-else
		>
			{{ $pt("noMoreCommands") }}
		</span>
	</section>
</template>
