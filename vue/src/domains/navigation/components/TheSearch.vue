<script setup lang="ts">
import { useGetFullProductSheets } from "@/domains/product/composables/useGetFullProductSheets";

const { SEARCH_PAGE, PRODUCT_PAGE } = routerPageName;
const router = useRouter();
const params = useRouteParams({ 
	productSheetName: zod.string().optional(),
});

const { getCategoryProductSheets, productSheets } = useGetFullProductSheets({
	available: "true",
	searchByRegex: params.value.productSheetName,
	take: 3,
});

const search = ref(params.value.productSheetName ?? "");
const suggestions = ref(false);

function openSuggestions() {
	suggestions.value = true;
}

function closeSuggestions(instant = false) {
	setTimeout(() => {
		suggestions.value = false;
	}, instant ? 0 : 300);
}

function clearSearch() {
	search.value = "";
}

function submit() {
	if (!search.value) {
		return;
	}

	closeSuggestions();
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
	<div class="lg:flex-1 flex gap-3 justify-end items-center">
		<form
			@submit="$event.preventDefault(); submit()"
			class="hidden relative lg:block grow max-w-144"
		>
			<input
				type="text"
				placeholder="Rechercher un produit..."
				class="w-full px-4 py-3 bg-whiteless rounded-full"
				v-model="search"
				@focus="openSuggestions"
				@blur="closeSuggestions()"
			>

			<ul
				v-if="search && productSheets && productSheets.length > 0 && suggestions"
				class="absolute top-[calc(100%+0.5rem)] left-0 hidden lg:flex flex-col gap-2 bg-whiteless rounded-lg p-4 shadow-lg w-full max-h-96 overflow-y-auto"
			>
				<li
					v-for="productSheet in productSheets"
					:key="productSheet.id"
				>
					<RouterLink
						:to="{ name: PRODUCT_PAGE, params: { productSheetId: productSheet.id } }"
						class="flex items-center gap-2"
						@click="closeSuggestions(true); clearSearch()"
					>
						<div class="flex items-center gap-2">
							<div class="shrink-0 w-12 h-12 flex justify-center items-center bg-white">
								<img
									v-if="productSheet.images.length > 0"
									:src="productSheet.images[0]"
									:alt="productSheet.name"
									class="w-12 h-12 object-cover rounded-lg"
								>

								<TheIcon
									v-else
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
				</li>
			</ul>
		</form>
	</div>
</template>

<style scoped>
.title-ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	/* number of lines to show */
	-webkit-box-orient: vertical;
}

.short-description-ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	/* number of lines to show */
	-webkit-box-orient: vertical;
}
</style>
