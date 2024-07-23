<script setup lang="ts">
const isAgeChecked = ref(localStorage.getItem("isAgeChecked") ?? "");

function checkAge(value?: string) {
	isAgeChecked.value = value ?? "";
}

function backToSafety() {
	history.back();
}

watch(isAgeChecked, () => {
	localStorage.setItem("isAgeChecked", isAgeChecked.value);
}, { immediate: true });
</script>

<template>
	<div v-if="!!!isAgeChecked">
		<div
		
			data-state="open"
			class="fixed inset-0 z-50 bg-black/80 backdrop-blur"
			data-aria-hidden="true"
			aria-hidden="true"
			style="pointer-events: auto;"
		/>

		<div
			data-dismissable-layer=""
			id="radix-vue-dialog-content-13"
			role="alertdialog"
			aria-describedby="radix-vue-dialog-description-15"
			aria-labelledby="radix-vue-dialog-title-14"
			data-state="open"
			tabindex="-1"
			class="fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
			style="pointer-events: auto;"
		>
			<div class="flex flex-col gap-y-2 items-center">
				<h2
					id="radix-vue-dialog-title-14"
					class="text-lg font-semibold"
				>
					{{ $t("modal.age.title") }}
				</h2>

				<div>
					<p
						id="radix-vue-dialog-description-15"
						class="text-sm text-muted-foreground"
					>
						{{ $t("modal.age.content") }}
					</p>

					<img
						src="/images/pegi-18.png"
						alt="Pegi 18"
						class="h-36 mx-auto mt-4"
					>
				</div>
			</div>

			<div class="flex gap-8 justify-center">
				<SecondaryButton
					@click="backToSafety()"
				>
					{{ $t("modal.age.cancel") }}
				</SecondaryButton>

				<PrimaryButton
					@click="checkAge('true')"
				>
					{{ $t("modal.age.confirm") }}
				</PrimaryButton>
			</div>
		</div>
	</div>
</template>
