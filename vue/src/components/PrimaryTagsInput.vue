<script setup lang="ts">
interface Props {
	modelValue?: string[]
}
defineProps<Props>();
const emit = defineEmits<{"update:modelValue": [value: string[]]}>();
</script>

<template>
	<TagsInput
		:model-value="modelValue"
		@update:model-value="(value) => emit('update:modelValue', value as string[])"
	>
		<TagsInputItem
			v-for="item in modelValue"
			:key="item"
			:value="item"
		>
			<TagsInputItemText />

			<TagsInputItemDelete />
		</TagsInputItem>
  
		<TagsInputInput placeholder="Fruits..." />
	</TagsInput>
</template>
