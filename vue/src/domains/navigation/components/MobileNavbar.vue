<script setup lang="ts">
import type { NavigationBar } from "@/lib/utils";

interface Props {
	navigationItems: NavigationBar
}

defineProps<Props>();

const { CATEGORY_PAGE } = routerPageName;
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
						to="/"
						class="text-center text-2xl font-bold"
					>
						<span>MET</span>
					</RouterLink>
				</SheetClose>

				<template
					v-for="item in navigationItems"
					:key="item.type"
				>
					<TheAccordion
						v-if="item.type === 'PARENT_CATEGORY'"
						type="single"
						collapsible
						class="w-full"
					>
						<AccordionItem 
							class="border-b-0"
							:value="item.parentCategoryName"
						>
							<AccordionTrigger class="hover:no-underline">
								{{ item.parentCategoryName }}
							</AccordionTrigger>

							<AccordionContent>
								<ul class="flex flex-col gap-2">
									<li
										v-for="category in item.categories"
										:key="category.categoryName"
										class="px-3 py-2 rounded-md bg-gradient-to-b from-muted/50 to-muted no-underline outline-none focus:shadow-md text-muted-foreground hover:text-foreground"
									>
										<SheetClose as-child>
											<RouterLink
												:to="{ name: CATEGORY_PAGE, params: { categoryName: category.categoryName } }"
												class="flex items-center gap-4"
											>
												<img
													:src="category.categoryImageUrl"
													class="w-24 aspect-video object-cover"
												>
												{{ category.categoryName }}
											</RouterLink>
										</SheetClose>
									</li>
								</ul>
							</AccordionContent>
						</AccordionItem>
					</TheAccordion>

					<SheetClose
						v-else-if="item.type === 'CATEGORY'"
						as-child
					>
						<RouterLink
							:to="{ name: CATEGORY_PAGE, params: { categoryName: item.categoryName } }"
							class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
						>
							{{ item.categoryName }}
						</RouterLink>
					</SheetClose>

					<SheetClose
						v-else
						as-child
					>
						<RouterLink
							:to="item.url"
							class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
						>
							{{ item.title }}
						</RouterLink>
					</SheetClose>
				</template>
			</nav>
		</SheetContent>
	</TheSheet>
</template>
