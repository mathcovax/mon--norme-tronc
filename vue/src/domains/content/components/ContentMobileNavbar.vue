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
	<TheSheet>
		<SheetTrigger as-child>
			<TheButton
				variant="outline"
				size="icon"
				class="shrink-0 md:hidden"
			>
				<TheIcon
					icon="menu"
					size="2xl"
				/>
			</TheButton>
		</SheetTrigger>

		<SheetContent
			side="left"
			class="flex flex-col"
		>
			<nav class="grid gap-2 text-lg font-medium">
				<SheetClose as-child>
					<RouterLink
						:to="{ name: CONTENT_PANEL_HOME }"
						class="mb-6 text-center text-2xl font-bold"
					>
						<span>{{ $t("layout.content.title") }}</span>
					</RouterLink>
				</SheetClose>

				<SheetClose as-child>
					<RouterLink
						:to="{ name: CONTENT_PANEL_HOME }"
						class="mx-[-0.65rem] px-3 py-2 flex items-center gap-4 rounded-xl hover:text-foreground"
						:class="
							route.name === CONTENT_PANEL_HOME ?
								'bg-muted text-foreground'
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
				</SheetClose>
				
				<SheetClose as-child>
					<RouterLink
						:to="{ name: CONTENT_PANEL_NAVIGATION_BAR }"
						class="mx-[-0.65rem] px-3 py-2 flex items-center gap-4 rounded-xl hover:text-foreground"
						:class="
							route.name === CONTENT_PANEL_NAVIGATION_BAR ?
								'bg-muted text-foreground'
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
				</SheetClose>
				
				<SheetClose as-child>
					<RouterLink
						:to="{ name: CONTENT_PANEL_PARENT_CATEGORIES }"
						class="mx-[-0.65rem] px-3 py-2 flex items-center gap-4 rounded-xl hover:text-foreground"
						:class="
							route.name === CONTENT_PANEL_PARENT_CATEGORIES ?
								'bg-muted text-foreground'
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
				</SheetClose>
				
				<SheetClose as-child>
					<RouterLink
						:to="{ name: CONTENT_PANEL_CATEGORIES }"
						class="mx-[-0.65rem] px-3 py-2 flex items-center gap-4 rounded-xl hover:text-foreground"
						:class="
							route.name === CONTENT_PANEL_CATEGORIES ?
								'bg-muted text-foreground'
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
				</SheetClose>

				<SheetClose as-child>
					<RouterLink
						:to="{ name: CONTENT_PANEL_NEWSLETTERS }"
						class="mx-[-0.65rem] px-3 py-2 flex items-center gap-4 rounded-xl hover:text-foreground"
						:class="
							route.name === CONTENT_PANEL_NEWSLETTERS ?
								'bg-muted text-foreground'
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
				</SheetClose>
			</nav>
		</SheetContent>
	</TheSheet>
</template>
