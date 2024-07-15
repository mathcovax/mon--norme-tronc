<script setup lang="ts">
import type TheSheet from "@/components/ui/sheet/TheSheet.vue";
import { useGetFullProductSheets } from "@/domains/product/composables/useGetFullProductSheets";

const { SEARCH_PAGE, PRODUCT_PAGE } = routerPageName;
const router = useRouter();
const params = useRouteParams({ 
	productSheetName: zod.string().optional(),
});
const open = ref<boolean>(false);
const { getCategoryProductSheets, productSheets } = useGetFullProductSheets({
	available: "true",
	searchByRegex: params.value.productSheetName,
	take: 3,
});

const search = ref(params.value.productSheetName ?? "");

function clearSearch() {
	search.value = "";
}

function submit() {
	if (!search.value) {
		return;
	}
	open.value = false;
	router.push({ name: SEARCH_PAGE, params: { productSheetName: search.value.trim() } });
}

watch(
	() => search.value,
	() => {
		if (!search.value) {
			return;
		}

		getCategoryProductSheets({ available: "true", searchByRegex: search.value, take: 3 });
	}
);
</script>

<template>
	<TheSheet v-model:open="open">
		<SheetTrigger
			class="lg:hidden cursor-pointer"
			as-child
		>
			<TheIcon
				icon="magnify"
				size="2xl"
			/>
		</SheetTrigger>

		<SheetContent>
			<SheetHeader class="mb-4">
				<SheetTitle>Rechercher</SheetTitle>
			</SheetHeader>

			<form
				@submit="$event.preventDefault(); submit()"
				class="relative flex flex-col gap-4"
			>
				<input
					type="text"
					placeholder="Rechercher un produit..."
					class="w-full px-4 py-3 bg-whiteless rounded-full"
					v-model="search"
				>

				<ul
					v-if="search && productSheets && productSheets.length > 0"
					class="p-4 flex flex-col gap-4"
				>
					<li
						v-for="productSheet in productSheets"
						:key="productSheet.id"
					>
						<SheetClose 
							@click="clearSearch"
							as-child
						>
							<RouterLink
								:to="{ name: PRODUCT_PAGE, params: { productSheetId: productSheet.id } }"
								class="flex items-center gap-2"
							>
								<div class="flex items-center gap-2">
									<img
										v-if="productSheet.images.length > 0"
										:src="productSheet.images[0]"
										:alt="productSheet.name"
										class="w-12 h-12 object-cover rounded-lg"
									>

									<div
										v-else
										class="shrink-0 w-12 h-12 flex justify-center items-center bg-white"
									>
										<TheIcon
											icon="image-outline"
											size="3xl"
											class="text-muted-foreground"
										/>
									</div>

									<div>
										<span
											class="title-ellipsis font-semibold"
											:title="productSheet.name"
										>
											{{ productSheet.name }}
										</span>

										<p
											class="short-description-ellipsis opacity-50"
											:title="productSheet.shortDescription"
										>
											{{ productSheet.shortDescription }}
										</p>
									</div>
								</div>
							</RouterLink>
						</SheetClose>
					</li>
				</ul>
			</form>
		</SheetContent>
	</TheSheet>
</template>

<style scoped>
.title-ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	/* number of lines to show */
	-webkit-box-orient: vertical;
}

.short-description-ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 4;
	/* number of lines to show */
	-webkit-box-orient: vertical;
}
</style>
