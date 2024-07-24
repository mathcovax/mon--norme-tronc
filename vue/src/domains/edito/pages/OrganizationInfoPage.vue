<script setup lang="ts">
import type { Organization } from "@/lib/utils";

const $pt = usePageTranslate();

const router = useRouter();

const params = useRouteParams({ 
	organizationId: zod.string(), 
});

const { EDITO_HOME } = routerPageName;

const organization = ref<Organization | null>(null);

function getOrganizationInfo() {
	return duploTo.enriched
		.get(
			"/organizations/{organizationId}",
			{ params: { organizationId: params.value.organizationId } }
		)
		.info("organization.found", (data) => {
			organization.value = data;
		})
		.e(() => {
			router.push({ name: EDITO_HOME });
		})
		.result;
}

function back() {
	history.back();
}

getOrganizationInfo();
</script>

<template>
	<section class="min-h-screen-nhm-mobile lg:min-h-screen-nhm-desktop container my-12 lg:my-16 flex flex-col gap-12">
		<h1 class="text-2xl font-bold lg:text-3xl">
			{{ organization?.name }}
		</h1>

		<div class="grow flex flex-col justify-between">
			<div class="flex flex-col md:flex-row gap-8">
				<div>
					<img
						v-if="organization?.logoUrl"
						:src="organization?.logoUrl"
						alt="seller"
						class="object-cover w-64 h-64"
					>

					<TheIcon
						v-else
						icon="storefront-outline"
						size="lg"
						class="flex items-center justify-center w-64 h-64 p-1 bg-muted/80 text-muted-foreground"
					/>
				</div>

				<ul>
					<li><strong>{{ $pt("label.id") }} : </strong>{{ organization?.id }}</li>

					<li><strong>{{ $pt("label.label") }} : </strong>{{ organization?.label ?? $pt("label.none") }}</li>

					<li>
						<strong>{{ $pt("label.emailSupport") }} : </strong>
						
						<a
							v-if="organization?.emailSupport"
							:href="`mailto:${organization?.emailSupport}`"
							target="_blank"
							class="text-sky-600 underline"
						>{{ organization?.emailSupport
						}}</a>

						<span v-else>{{ $pt("label.none") }}</span>
					</li>
				</ul>
			</div>
		
			<SecondaryButton
				@click="back()"
			>
				{{ $t("button.back") }}
			</SecondaryButton>
		</div>
	</section>
</template>
