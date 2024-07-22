<script setup lang="tsx">
import { SwitchRoot, SwitchThumb } from "radix-vue";

interface Props {
  label: string[]
  state: boolean;
}

defineProps<Props>();
</script>

<template>
	<div class="col-span-12 flex items-center justify-center my-4">
		<label
			class="text-black capitalize text-[15px] leading-none pr-[15px] select-none"
			for="airplane-mode"
		>
			{{ state ? label[1] : label[0] }}
		</label>

		<SwitchRoot
			id="airplane-mode"
			:checked="state"
			class="w-[2.41rem] h-[20px] cursor-pointer flex bg-black/50 shadow-sm rounded-full relative data-[state=checked]:bg-black"
		>
			<SwitchThumb
				class="block w-[18px] h-[18px] my-auto bg-white shadow-sm rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]"
			/>
		</SwitchRoot>
	</div>
</template>
