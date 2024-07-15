<script setup lang="ts">
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app as firebaseApp } from "@/lib/firebase";

const $pt = usePageTranslate(); 
const provider = new GoogleAuthProvider();
const auth = getAuth(firebaseApp);
const router = useRouter();
const { setAccessToken, fetchUserValue } = useUserStore();
const query = useRouteQuery({ 
	redirect: zod.string().optional(), 
});

async function googleSign() {
	try {
		const result = await signInWithPopup(auth, provider);
		const fireBaseIdToken = await result.user.getIdToken();

		await duploTo.enriched.post("/login", fireBaseIdToken, undefined, { disabledToast: ["user.notfound"] })
			.info("user.logged", accessToken => {
				setAccessToken(accessToken);
				fetchUserValue();
				router.push({ name: query.value.redirect ?? routerPageName.EDITO_HOME });
			})
			.info("user.notfound", () => {
				router.push({ 
					name: routerPageName.AUTH_REGISTER, 
					query: { 
						fireBaseIdToken, 
						redirect: query.value.redirect 
					} 
				});
			})
			.result;	
	}
	catch { 
		// Handle error
	}
}
</script>

<template>
	<section class="h-screen-nh flex items-center justify-center container">
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

					<div class="grid gap-4">
						<PrimaryButton
							@click="googleSign"
							class="w-full"
						>
							{{ $t("button.login") }}
						</PrimaryButton>
					</div>
				</div>
			</div>

			<div class="hidden bg-muted lg:block">
				<img
					src="/images/login.png"
					alt="Image"
					class="object-cover w-full h-full"
				>
			</div>
		</div>
	</section>
</template>
