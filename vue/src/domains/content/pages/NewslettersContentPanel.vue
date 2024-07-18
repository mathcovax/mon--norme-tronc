<script setup lang="ts">
import type { Newsletter } from "@/lib/utils";
import { useGetNewsletters } from "../composables/useGetNewsletters";
import { useNewsletterForm } from "../composables/useNewsletterForm";
//@ts-expect-error missing déclaration vue3-markdown
import { VMarkdownEditor } from "vue3-markdown";
import "vue3-markdown/dist/style.css";

const $pt = usePageTranslate(); 

const {
	NewsletterForm,
	checkNewsletterForm,
	resetNewsletterForm
} = useNewsletterForm();

const {
	newsletters,
	newslettersQuery,
	refreshNewsletters
} = useGetNewsletters();

const cols: BigTableColDef<Newsletter>[] = [
	{
		title: $pt("table.label.title"),
		getter: i => i.object
	},
	{
		title: $pt("table.label.createdAt"),
		getter: i => i.createdAt.toString().split("T")[0] 
	},
	{
		title: $t("label.actions"),
		slotName: "actions"
	},
];

async function submitNewsletter() {
	const formField = await checkNewsletterForm();

	if (!formField) {
		return;
	}

	const result = await duploTo.enriched
		.post(
			"/newsletter",
			{ object: formField.object, content: formField.content, sendAt: formField.sendAt }
		)
		.result;

	if (result.success && result.info === "newsletter.created") {
		resetNewsletterForm();
		refreshNewsletters();
	}
}

function deleteItem(item: Newsletter) {
	if (!item.id) {
		return;
	}

	duploTo.enriched
		.delete(
			"/newsletter/{newsletterId}",
			{ params: { newsletterId: item.id } }
		)
		.info("newsletter.deleted", () => {
			resetNewsletterForm();
			refreshNewsletters();
		});
}

function next() {
	if (!newslettersQuery.page || newsletters.value.length < 10) {
		return;
	}

	newslettersQuery.page++;
}

function previous() {
	if (!newslettersQuery.page || newslettersQuery.page === 0) {
		return;
	}

	newslettersQuery.page--;
}
</script>

<template>
	<section>
		<h1 class="mb-12 text-2xl font-semibold">
			{{ $pt("title") }}
		</h1>

		<div class="w-full flex flex-col items-center p-6 gap-10">
			<h2 class="text-xl font-semibold">
				{{ $pt("form.title") }}
			</h2>

			<NewsletterForm @submit="submitNewsletter">
				<template #content="{onUpdate, modelValue}">
					<VMarkdownEditor
						:model-value="modelValue"
						@update:model-value="onUpdate"
						class="min-h-96"
					/>
				</template>

				<template #sendAt="{ modelValue, onUpdate }">
					<input
						class="
							rounded-md border border-input bg-background px-3 py-2 text-sm
							placeholder:text-muted-foreground
							focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
						"
						type="datetime-local"
						:value="modelValue"
						@change="(event: Event) => onUpdate((event.target as HTMLInputElement).value)"
					>
				</template>

				<PrimaryButton
					type="submit"
					class="col-span-12"
				>
					{{ $t("button.validate") }}
				</PrimaryButton>
			</NewsletterForm>

			<div class="flex flex-col items-center w-full gap-3">
				<PrimaryInput
					class="max-w-[300px]"
					:placeholder="$pt('table.searchPlaceholder')"
					v-model="newslettersQuery.object"
				/>

				<BigTable
					:cols="cols"
					:items="newsletters"
					:current-page="(newslettersQuery.page ?? 0) + 1"
					@click-next="next"
					@click-previous="previous"
				>
					<template #actions="{item}">
						<WithValidation
							:title="$pt('popup.title')"
							:content="$pt('popup.content')"
							class="col-span-4"
							@validate="deleteItem(item)"
						>
							<TheButton
								type="button"
								variant="destructive"
							>
								{{ $t("button.remove") }}
							</TheButton>
						</WithValidation>
					</template>
				</BigTable>
			</div>
		</div>
	</section>
</template>
