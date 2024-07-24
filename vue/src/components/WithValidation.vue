<script setup lang="ts">
interface Props {
	title: string
	content?: string
	class?: HTMLElement["className"]
	destructive?: boolean
	disabled?: boolean
}

const props = defineProps<Props>();

const emit = defineEmits<{
	validate: []
	disabledClick: []
}>();
</script>

<template>
	<ThePopup class="flex flex-col gap-4">
		<template #trigger="{ open }">
			<div
				:class="props.class"
				@click="disabled ? emit('disabledClick') : open()"
			>
				<slot />
			</div>
		</template>

		<template #popupContent="{ close }">
			<h2 class="text-2xl font-bold">
				{{ title }}
			</h2>

			<p
				v-if="content"
				class="text-base"
			>
				{{ content }}
			</p>

			<div class="flex gap-3 justify-end">
				<TheButton
					size="lg"
					variant="secondary"
					@click="close()"
				>
					{{ $t("button.cancel") }}
				</TheButton>

				<TheButton
					size="lg"
					:variant="props.destructive ? 'destructive' : 'default'"
					@click="() => { emit('validate'); close(); }"
				>
					{{ $t("button.validate") }}
				</TheButton>
			</div>
		</template>
	</ThePopup>
</template>
