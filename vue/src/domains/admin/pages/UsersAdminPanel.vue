<script setup lang="ts">
import { useUserForm } from "../composables/useUserForm";
import { useGetUsers } from "../composables/useGetUsers";
import { primordialRoles, type PrimordialRole, type User } from "@/lib/utils";
import type ThePopup from "@/components/ThePopup.vue";

const $pt = usePageTranslate(); 

const {
	UserForm,
	checkUserForm,
	resetUserForm,
	valuesUserForm
} = useUserForm();

const { getUsers, users } = useGetUsers();

const currentPage = ref(0);
const search = reactive({
	email: "",
	role: undefined as PrimordialRole | undefined
});
const popup = ref<InstanceType<typeof ThePopup>>();

async function submit() {
	const formFields = await checkUserForm();

	if (!formFields) {
		return;
	}

	await duploTo.enriched
		.patch(
			"/users/{userId}@admin",
			{
				primordialRole: formFields.primordialRole,
				muted: formFields.muted,
			},
			{ params: { userId: formFields.user.id } }
		)
		.info("user.edited", () => {
			resetUserForm();
			getUsers(currentPage.value, search.email, search.role);
			popup.value?.close();
		});
}

const cols: BigTableColDef<User>[] = [
	{
		title: $t("label.email"),
		getter: i => i.email
	},
	{
		title: $t("label.lastname"),
		getter: i => i.lastname
	},
	{
		title: $t("label.firstname"),
		getter: i => i.firstname
	},
	{
		title: $t("label.role"),
		getter: i => $t(`role.${i.primordialRole}`)
	},
];

function next() {
	if (users.value.length < 10) {
		return;
	}
	getUsers(currentPage.value += 1, search.email, search.role);
}

function previous() {
	if (currentPage.value === 0) {
		return;
	}
	getUsers(currentPage.value -= 1, search.email, search.role);
}

function clear() {
	search.email = "";
	search.role = undefined;
}

function openPopup(user: User) {
	if (user.primordialRole === "ADMIN") {
		return;
	}

	valuesUserForm.user.value = user;
	valuesUserForm.primordialRole.value = user.primordialRole;
	valuesUserForm.muted.value = user.muted;
	popup.value?.open();
}

getUsers(currentPage.value, search.email, search.role);
watch(
	() => search.email + search.role,
	() => getUsers(currentPage.value = 0, search.email, search.role)
);
</script>

<template>
	<section>
		<h1 class="mb-12 text-2xl font-semibold">
			{{ $pt("title") }}
		</h1>

		<div class="flex flex-col items-center w-full gap-6 p-6">
			<div class="flex justify-center w-full gap-6">
				<PrimaryInput
					class="max-w-[300px]"
					:placeholder="$pt('table.searchPlaceholder')"
					v-model="search.email"
				/>

				<PrimarySelect
					class="max-w-[300px]"
					:items="primordialRoles.map(r => ({ label: $t(`role.${r}`), value: r }))"
					:placeholder="$pt('table.searchPlaceholderRole')"
					v-model="search.role"
				/>

				<SecondaryButton @click="clear">
					{{ $t("button.clear") }}
				</SecondaryButton>
			</div>

			<BigTable
				:items="users"
				:cols="cols"
				:current-page="currentPage + 1"
				:action-label="$pt('table.cols.actions')"
				@click-next="next"
				@click-previous="previous"
				@click-on-row="openPopup"
			/>
		</div>

		<ThePopup
			ref="popup"
			class="max-w-[500px] w-[80%]"
		>
			<template #popupContent>
				<UserForm
					@submit="submit"
					class="items-center"
				>
					<template #user="{ modelValue }">
						<span class="text-center">{{ modelValue?.email }}</span>
					</template>

					<PrimaryButton
						type="submit"
						class="col-span-12"
					>
						{{ $t("button.send") }}
					</PrimaryButton>
				</UserForm>
			</template>
		</ThePopup>
	</section>
</template>
