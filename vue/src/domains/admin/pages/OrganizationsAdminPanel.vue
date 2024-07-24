<script setup lang="ts">
import type { Organization } from "@/lib/utils";
import { useCreateOrganizationForm } from "../composables/useCreateOrganizationForm"; 
import { useGetOganizations } from "../composables/useGetOganizations"; 

const { 
	CreateOrganizationForm, 
	checkCreateOrganizationForm, 
	resetCreateOrganizationForm 
} = useCreateOrganizationForm();
const $pt = usePageTranslate();
const { organizations, getOrganizations } = useGetOganizations();

async function submit() {
	const formFields = await checkCreateOrganizationForm();

	if (!formFields) {
		return;
	}

	await duploTo.enriched
		.post(
			"/organizations",
			{
				name: formFields.name,
				ownerId: formFields.ownerId
			}
		)
		.info("organization.created", () => {
			resetCreateOrganizationForm();
			getOrganizations(currentPage.value = 0, searchName.value = "");
		});
}

const currentPage = ref(0);
const searchName = ref("");
const cols: BigTableColDef<Organization>[] = [
	{
		title: $pt("table.col.name"),
		getter: i => i.name
	},
	{
		title: $t("label.id"),
		getter: i => i.id
	},
	{
		title: $pt("table.col.active"),
		slotName: "suspended", 
	},
	{
		title: $pt("table.col.actions"),
		slotName: "actions", 
		cols: 2
	},
];

function next() {
	if (organizations.value.length < 10) {
		return;
	}
	getOrganizations(currentPage.value+=1, searchName.value);
}

function previous() {
	if (currentPage.value === 0) {
		return;
	}
	getOrganizations(currentPage.value-=1, searchName.value);
}

function suspended(organization: Organization) {
	duploTo.enriched
		.patch(
			"/organizations/{organizationId}@admin",
			{
				suspended: !organization.suspended
			},
			{ params: { organizationId: organization.id } }
		)
		.info("organization.edited", () => {
			getOrganizations(currentPage.value, searchName.value);
		});
}

getOrganizations(currentPage.value, searchName.value);
watch(searchName, () => getOrganizations(currentPage.value = 0, searchName.value));
</script>

<template>
	<section>
		<h1 class="mb-12 text-2xl font-semibold">
			{{ $pt("title") }}
		</h1>

		<div class="flex flex-col items-center w-full gap-10 p-6">
			<h2 class="text-xl font-semibold">
				{{ $pt("form.title") }}
			</h2>

			<CreateOrganizationForm
				@submit="submit"
				class="max-w-[500px] w-[80%]"
			>
				<PrimaryButton
					type="submit"
					class="col-span-12"
				>
					{{ $t("button.add") }}
				</PrimaryButton>
			</CreateOrganizationForm>

			<div class="flex flex-col items-center w-full gap-3">
				<PrimaryInput
					class="max-w-[300px]"
					:placeholder="$pt('table.searchPlaceholder')"
					v-model="searchName"
				/>

				<BigTable
					:items="organizations"
					:cols="cols"
					:current-page="currentPage + 1"
					:action-label="$pt('table.col.actions')"
					@click-next="next"
					@click-previous="previous"
				>
					<template #suspended="{item}">
						<TheIcon
							:icon="item.suspended ? 'close' : 'check'"
							:class="{
								'text-green-400': !item.suspended, 
								'text-red-400': item.suspended
							}"
						/>
					</template>

					<template #actions="{item}">
						<SecondaryButton @click="suspended(item)">
							{{ $pt(item.suspended ? "table.action.activate" : "table.action.suspend") }}
						</SecondaryButton>
					</template>
				</BigTable>
			</div>
		</div>
	</section>
</template>
