<script setup lang="ts">
defineProps<{
  step: number;
  paymentState: string;
}>();

const $pt = usePageTranslate();

const emits = defineEmits<{
	"update:step": [number];
}>();

function updateStep(currentStep: number, step: number) {
	if (currentStep === step || step > currentStep) {
		return;
	}
	emits("update:step", step);
}
</script>

<template>
	<div class="flex md:flex-col md:gap-20 md:items-center">
		<div class="w-full">
			<div class="relative mb-2">
				<div
					class="flex items-center justify-center w-10 h-10 mx-auto rounded-full"
					:class="{
						'bg-muted border-2 border-primary text-primary': step === 1,
						'bg-primary text-white': step > 1,
					}"
				>
					<TheIcon
						icon="map-marker-outline"
						size="2xl"
						class="cursor-pointe"
						@click="updateStep(step, 1)"
					/>
				</div>
			</div>

			<div
				class="text-xs text-center md:text-base"
			>
				{{ $pt('step.info') }}
			</div>
		</div>

		<div class="w-full">
			<div class="relative mb-2">
				<div class="absolute top-1/2 md:-top-full w-[calc(100%-2.5rem-1rem)] md:w-[calc(50%-2.5rem-1rem)] md:left-1/2 flex align-center items-center align-middle content-center -translate-x-1/2 -translate-y-1/2 md:rotate-90">
					<div class="items-center flex-1 w-full align-middle rounded bg-muted align-center">
						<div
							class="py-1 rounded bg-primary"
							:class="step > 1 ? 'w-full' : 'w-0'"
						/>
					</div>
				</div>

				<div
					class="flex items-center justify-center w-10 h-10 mx-auto rounded-full"
					:class="{
						'border-2 border-muted text-muted': step < 2,
						'border-2 border-primary text-primary': step === 2,
						'bg-primary text-white': step > 2,
					}"
				>
					<TheIcon
						icon="cart-outline"
						size="2xl"
						class="cursor-pointer"
						@click="updateStep(step, 2)"
					/>
				</div>
			</div>

			<div
				class="text-xs text-center md:text-base"
				:class="{
					'text-muted': step < 2,
					'text-primary': step === 2,
				}"
			>
				{{ $pt('step.cart.title') }}
			</div>
		</div>

		<div class="w-full">
			<div class="relative mb-2">
				<div
					class="absolute top-1/2 md:-top-full w-[calc(100%-2.5rem-1rem)] md:w-[calc(50%-2.5rem-1rem)] md:left-1/2 flex align-center items-center align-middle content-center -translate-x-1/2 -translate-y-1/2 md:rotate-90"
				>
					<div class="items-center flex-1 w-full align-middle rounded bg-muted align-center">
						<div
							class="py-1 rounded bg-primary"
							:class="step > 2 ? 'w-full' : 'w-0'"
						/>
					</div>
				</div>

				<div
					class="flex items-center justify-center w-10 h-10 mx-auto rounded-full"
					:class="{
						'border-2 border-muted text-muted': step < 3,
						'border-2 border-primary text-primary': step === 3,
						'bg-primary text-white': step === 3,
					}"
				>
					<TheIcon
						:icon="paymentState === 'success' ? 'check-bold' : 'close-thick'"
						size="2xl"
						class="cursor-pointer"
						@click="updateStep(step, 3)"
					/>
				</div>
			</div>

			<div
				class="text-xs text-center md:text-base"
				:class="{
					'text-muted': step < 3,
					'text-primary': step === 3,
				}"
			>
				{{ paymentState === 'success' ? $pt('step.success') : $pt('step.error') }}
			</div>
		</div>
	</div>
</template>
