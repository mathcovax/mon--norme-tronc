<script setup lang="ts">
import SecondaryButton from "@/components/SecondaryButton.vue";
import { useEditUserProfilForm } from "../composables/useEditUserProfilForm";

const $pt = usePageTranslate();

const userStore = useUserStore();

const {
	EditUserProfilForm,
	checkEditUserProfilForm,
} = useEditUserProfilForm();

async function submit() {
	const formFields = await checkEditUserProfilForm();

	if (!formFields) {
		return;
	}

	await duploTo.enriched
		.patch(
			"/user",
			{
				lastname: formFields.lastname,
				firstname: formFields.firstname,
				address: formFields.address,
				emailNotifcationsNewsletter: formFields.emailNotifcationsNewsletter,
				emailNotifcationsProductStock: formFields.emailNotifcationsProductStock,
				emailNotifcationsPromotion: formFields.emailNotifcationsPromotion,
				emailNotifcationsNewProductInCategory: formFields.emailNotifcationsNewProductInCategory,
			},
		)
		.info("user.edited", () => {
			location.href = "/login";
		})
		.result;
}

function deleteUser() {
	return duploTo.enriched
		.delete("/user")
		.info("user.delete", () => {
			userStore.removeAccessToken();
		})
		.result;
}

function pullData() {
	return duploTo.enriched.post("/user/pull-data", undefined);
}
</script>

<template>
	<section class="min-h-screen-nhm-mobile lg:min-h-screen-nhm-desktop my-12 lg:my-16 container flex flex-col gap-12">
		<h1 class="text-2xl font-bold lg:text-3xl">
			{{ $pt("title") }}
		</h1>

		<div class="mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
			<aside class="flex flex-col items-center gap-4 text-sm text-muted-foreground">
				<div class="flex items-center justify-center w-32 h-32 rounded-full bg-secondary">
					<TheIcon
						icon="account-outline"
						size="3xl"
					/>
				</div>

				<div class="text-center">
					{{ userStore.user?.firstname }} {{ userStore.user?.lastname }}
				</div>
			</aside>

			<div class="grid gap-6">
				<EditUserProfilForm 
					@submit="submit"
				>
					<PrimaryButton
						type="submit"
						class="col-span-12"
					>
						{{ $t("button.save") }}
					</PrimaryButton>

					<SecondaryButton
						class="col-span-6"
						type="button"
						@click="pullData"
					>
						{{ $pt("btnPullData") }}
					</SecondaryButton>

					<WithValidation
						class="col-span-6"
						:title="$pt('deletePopup.title')"
						:content="$pt('deletePopup.content')"
						@validate="deleteUser"
					>
						<TheButton
							class="w-full"
							variant="destructive"
							type="button"
						>
							{{ $pt("btnDelete") }}
						</TheButton>
					</WithValidation>
				</EditUserProfilForm>
			</div>
		</div>
	</section>
</template>
