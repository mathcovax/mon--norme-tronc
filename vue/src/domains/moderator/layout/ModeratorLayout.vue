<script setup lang="ts">
const route = useRoute();
const {
	MODERATOR_PANEL_HOME,
	MODERATOR_PANEL_CHECK_PRODUCT_SHEET_REVIEW,
	MODERATOR_PANEL_CHECK_PRODUCT_SHEET,
	EDITO_HOME,
} = routerPageName;
interface Onglet {
	pageName: (typeof routerPageName)[keyof typeof routerPageName]
	icon: string
}

const onglets: Onglet[] = [
	{
		pageName: MODERATOR_PANEL_HOME,
		icon: "home",
	},
	{
		pageName: MODERATOR_PANEL_CHECK_PRODUCT_SHEET_REVIEW,
		icon: "comment-check-outline",
	},
	{
		pageName: MODERATOR_PANEL_CHECK_PRODUCT_SHEET,
		icon: "file-document-check-outline",
	},
	{
		pageName: EDITO_HOME,
		icon: "arrow-left-bottom-bold",
	},
];
</script>

<template>
	<div class="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
		<div class="h-full">
			<nav class="grid items-start py-4 px-2 text-sm font-medium lg:px-4">
				<RouterLink 
					v-for="onglet of onglets"
					:key="onglet.pageName"
					:to="{ name: onglet.pageName }"
					class="flex items-center gap-3 px-3 py-2 transition-all rounded-lg hover:text-primary"
					:class="
						route.name === onglet.pageName ?
							'bg-muted text-primary'
							:
							'text-muted-foreground'
					"
				>
					<TheIcon
						:icon="onglet.icon"
						size="2xl"
					/>

					{{ $t(`layout.moderator.nav.${onglet.pageName}`) }}
				</RouterLink>
			</nav>
		</div>

		<main class="flex flex-col shadow-inner-top-left grow overflow-hidden">
			<RouterView class="overflow-y-auto p-4 lg:p-8" />
		</main>
	</div>
</template>
