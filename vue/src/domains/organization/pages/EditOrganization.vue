<script lang="ts" setup>
import { useOrganizationEditForm } from "../composables/useOrganizationEditForm";
const params = useRouteParams({
	organizationId: zod.string()
});
const {
	FormOrganizationEdit,
	checkFormOrganizationEdit,
	valuesFormOrganziationEdit
} = useOrganizationEditForm(params.value.organizationId);
const $pt = usePageTranslate();

async function submit () {
	const formFields = await checkFormOrganizationEdit();

	if (!formFields) {
		return;
	}

	duploTo.enriched
		.patch(
			"/organization/{organizationId}",
			{
				label: formFields.label === "" ? null : formFields.label
			},
			{ params: { organizationId: params.value.organizationId } }
		);

	if (!formFields.logo?.blob) {
		return; 
	}

	const formData = new FormData();
	formData.append("logo", formFields.logo?.blob);

	duploTo
		.put(
			"/organization/{organizationId}/logo",
			formData,
			{ params: { organizationId: params.value.organizationId } }
		);
}
const inputFile = ref<null | HTMLInputElement>(null);
function addLogo() {
	if (!inputFile.value?.files?.[0]) {
		return; 
	}

	valuesFormOrganziationEdit.logo.value = {
		blob: inputFile.value.files[0], 
		url: URL.createObjectURL(inputFile.value.files[0]) 
	};
}
</script>

<template>
	<section>
		<h1 class="mb-12 text-2xl font-semibold">
			Modification de l'organisation
		</h1>

		<div class="p-6 flex flex-col items-center w-full">
			<FormOrganizationEdit
				@submit="submit"
				class="max-w-[500px] w-[80%]"
			>
				<template #logo="{ modelValue }">
					<div class="flex flex-col items-center gap-4">
						<input
							ref="inputFile"
							type="file"
							class="fixed top-full left-full"
							accept="image/png, image/jpeg"
							@input="addLogo"
						>

						<SecondaryButton
							type="button"
							class="w-full"
							@click="inputFile?.click()"
						>
							<TheIcon icon="plus" />
							{{ $pt("form.addLogo") }}
						</SecondaryButton>

						<img
							v-if="modelValue"
							:src="modelValue.url"
							alt="Logo de l'organization"
						>

						<small
							v-else
						>
							Vous n'avez pas de logo. Ajoutez-en un!
						</small>
					</div>
				</template>

				<PrimaryButton
					type="submit"
					class="col-span-12"
				>
					{{ $t("button.save") }}
				</PrimaryButton>
			</FormOrganizationEdit>
		</div>
	</section>
</template>
