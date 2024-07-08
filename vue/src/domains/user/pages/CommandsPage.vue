<script setup lang="ts">
import CommandCard from "../components/CommandCard.vue";
import { useGetCommands } from "../composables/useGetCommands";

const $pt = usePageTranslate();
const { commands } = useGetCommands();

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
	</section>
</template>
