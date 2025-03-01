<script setup lang="ts">
import { useSignUpForm } from "../composables/useSignUpForm"; 

const $pt = usePageTranslate(); 
const { SignUpForm, checkSignUpForm } = useSignUpForm();
const query = useRouteQuery({ 
	fireBaseIdToken: zod.string(),
	redirect: zod.string().optional(),
});
const router = useRouter();
const { setAccessToken, fetchUserValue } = useUserStore();

async function submit() {
	const formFields = await checkSignUpForm();

	if (!formFields) {
		return;
	}

	await duploTo.enriched.post(
		"/users", 
		{
			fireBaseIdToken: query.value.fireBaseIdToken,
			firstname: formFields.fistname,
			lastname: formFields.lastname,
			address: formFields.address,
			dateOfBirth: new Date(formFields.dateOfBirth),
			emailNotifcationsNewsletter: !!formFields.emailNotifcationsNewsletter,
		}
	)
		.info("user.registered", (accessToken) => {
			setAccessToken(accessToken);
			fetchUserValue();
			router.push({ name: query.value.redirect ?? routerPageName.EDITO_HOME });
		})
		.result;
}
</script>

<template>
	<section class="h-screen-nh flex justify-center items-center container">
		<div class="w-full h-full flex items-center justify-center lg:grid lg:items-stretch lg:justify-normal lg:grid-cols-2">
			<div class="flex items-center justify-center py-12">
				<div class="mx-auto grid w-[350px] gap-6">
					<div class="grid gap-2 text-center">
						<h1 class="text-3xl font-bold">
							{{ $pt("title") }}
						</h1>

						<p class="text-balance text-muted-foreground">
							{{ $pt("subtitle") }}
						</p>
					</div>

					<SignUpForm @submit="submit">
						<template #terms="{ modelValue, onUpdate }">
							<div class="flex gap-2 items-center ">
								<TheCheckbox
									id="terms"
									:checked="modelValue"
									@update:checked="onUpdate"
									class="col-span-12"
								/>

								<label
									for="terms"
									class="text-sm font-medium leading-none hover:cursor-pointer"
								>{{ $t("label.terms") }}</label>
							</div>

							<small style="grid-column: span 12 / span 12;">
								<a 
									href="/cgu"
									target="_blank"
									class="hover:underline hover:text-sky-600"
								>
									{{ $pt("seeCgu") }}
								</a>
							</small>
						</template>

						<PrimaryButton
							type="submit"
							class="col-span-12"
						>
							{{ $t("button.register") }}
						</PrimaryButton>
					</SignUpForm>
				</div>
			</div>

			<div class="hidden bg-muted lg:block">
				<img
					src="/images/register.png"
					alt="Image"
					class="h-full w-full object-cover"
				>
			</div>
		</div>
	</section>
</template>
