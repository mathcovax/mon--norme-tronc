<script setup lang="ts">
const {
	CONTENT_PANEL_HOME,
	CONTENT_PANEL_NAVIGATION_BAR,
	CONTENT_PANEL_PARENT_CATEGORIES,
	CONTENT_PANEL_CATEGORIES,
	CONTENT_PANEL_NEWSLETTERS
} = routerPageName;
const route = useRoute();
</script>

<template>
	<div class="hidden border-r bg-muted/40 md:block">
		<div class="flex h-full max-h-screen flex-col gap-2">
			<div class="flex h-24 justify-center items-center border-b px-4 lg:px-6">
				<RouterLink
					:to="{ name: CONTENT_PANEL_HOME }"
					class="flex items-center gap-2 text-center font-semibold"
				>
					<span>{{ $t("layout.content.title") }}</span>
				</RouterLink>
			</div>

			<div class="flex-1">
				<nav class="grid items-start px-2 text-sm font-medium lg:px-4">
					<RouterLink
						:to="{ name: CONTENT_PANEL_HOME }"
						class="px-3 py-2 flex items-center gap-3 rounded-lg transition-all hover:text-primary"
						:class="
							route.name === CONTENT_PANEL_HOME ?
								'bg-muted text-primary'
								:
								'text-muted-foreground'
						"
					>
						<TheIcon
							icon="home-outline"
							size="2xl"
						/>
						{{ $t("layout.content.nav.dashboard") }}
					</RouterLink>

					<RouterLink
						:to="{ name: CONTENT_PANEL_NAVIGATION_BAR }"
						class="px-3 py-2 flex items-center gap-3 rounded-lg transition-all hover:text-primary"
						:class="
							route.name === CONTENT_PANEL_NAVIGATION_BAR ?
								'bg-muted text-primary'
								:
								'text-muted-foreground'
						"
					>
						<TheIcon
							icon="magnify"
							size="2xl"
						/>
						{{ $t("layout.content.nav.navbar") }}
					</RouterLink>

					<RouterLink
						:to="{ name: CONTENT_PANEL_PARENT_CATEGORIES }"
						class="px-3 py-2 flex items-center gap-3 rounded-lg transition-all hover:text-primary"
						:class="
							route.name === CONTENT_PANEL_PARENT_CATEGORIES ?
								'bg-muted text-primary'
								:
								'text-muted-foreground'
						"
					>
						<TheIcon
							icon="shape-outline"
							size="2xl"
						/>
						{{ $t("layout.content.nav.parentCategories") }}
					</RouterLink>

					<RouterLink
						:to="{ name: CONTENT_PANEL_CATEGORIES }"
						class="px-3 py-2 flex items-center gap-3 rounded-lg transition-all hover:text-primary"
						:class="
							route.name === CONTENT_PANEL_CATEGORIES ?
								'bg-muted text-primary'
								:
								'text-muted-foreground'
						"
					>
						<TheIcon
							icon="shape-plus-outline"
							size="2xl"
						/>
						{{ $t("layout.content.nav.categories") }}
					</RouterLink>

					<RouterLink
						:to="{ name: CONTENT_PANEL_NEWSLETTERS }"
						class="px-3 py-2 flex items-center gap-3 rounded-lg transition-all hover:text-primary"
						:class="
							route.name === CONTENT_PANEL_NEWSLETTERS ?
								'bg-muted text-primary'
								:
								'text-muted-foreground'
						"
					>
						<TheIcon
							icon="text-box-multiple-outline"
							size="2xl"
						/>
						{{ $t("layout.content.nav.newsletters") }}
					</RouterLink>
				</nav>
			</div>
		</div>
	</div>
</template>

