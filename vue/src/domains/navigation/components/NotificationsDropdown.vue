<script setup lang="ts">
import type { FullNotification } from "@/lib/utils";


const fullNotifications = ref<FullNotification[]>([]);
const page = ref(0);
const canSeeMore = ref(true);
const lastNotificationTimestamp = ref<number>(Number(localStorage.getItem("timestampNotification") ?? Date.now()));
const showPellet = ref(false);
const isDropdownOpen = ref(false);

function getUserNotifications(page: number, push: boolean) {
	return duploTo.enriched
		.get(
			"/user/notifications",
			{ query: { page } }
		)
		.info("userNotifications", (data) => {
			if (data.length < 10) {
				canSeeMore.value = false;
			}
			if (push === true) {
				fullNotifications.value.push(...data);
			} else {
				fullNotifications.value = data;
			}
		});
}

watch(
	isDropdownOpen,
	() => {
		if (isDropdownOpen.value === false) {
			if (fullNotifications.value[0]) {
				if (showPellet.value === true) {
					showPellet.value = false;
					lastNotificationTimestamp.value = new Date(fullNotifications.value[0].createdAt).getTime();
				}
			}		
		}
	}
);

watch(
	lastNotificationTimestamp,
	() => localStorage.setItem("timestampNotification", lastNotificationTimestamp.value.toString()),
	{ immediate: true }
);

watch(
	fullNotifications,
	() => {
		if (fullNotifications.value[0]) {
			if (new Date(fullNotifications.value[0].createdAt).getTime() !== lastNotificationTimestamp.value) {
				showPellet.value = true;
			}
		}
	},
	{ immediate: true }
);

setInterval(
	() => {
		if (isDropdownOpen.value === false) {
			getUserNotifications(0, false);
			canSeeMore.value = true;
		}
	},
	1000 * 60 * 2
);

getUserNotifications(page.value, false);
</script>

<template>
	<DropdownMenu
		v-model:open="isDropdownOpen"
	>
		<DropdownMenuTrigger as-child>
			<SecondaryButton
				size="icon"
				class="rounded-full"
			>
				<TheIcon
					:icon="showPellet ? 'bell-ring' : 'bell-outline'"
					:class="showPellet ? 'text-yellow-500' : ''"
					size="2xl"
				/>
			</SecondaryButton>
		</DropdownMenuTrigger>

		<DropdownMenuContent
			align="end"
			class="w-full max-w-100"
		>
			<DropdownMenuLabel>
				{{ $t("layout.default.header.dropdown.notifications.title") }}
			</DropdownMenuLabel>

			<DropdownMenuSeparator />

			<ScrollArea class="h-96 min-w-96">
				<div class="flex flex-col gap-4 p-2 mb-6">
					<DropdownMenuItem
						v-for="(notification, index) in fullNotifications"
						:key="index"
						class="flex items-center gap-4"
					>
						<img
							:src="notification.imageUrl"
							:alt="notification.title"
							class="w-12 h-12 rounded-sm"
						>

						<div>
							<div class="flex items-center gap-2">
								<p class="font-bold">
									{{ notification.title }}
								</p>

								<TheIcon
									v-if="new Date(notification.createdAt).getTime() > lastNotificationTimestamp"
									icon="new-box"
									size="3xl"
									class="text-yellow-500"
								/>
							</div>

							<RouterLink
								v-if="notification.redirect"
								:to="notification.redirect"
								class="text-blue-500"
							>
								<span
									v-if="notification.type === 'PRODUCT_NO_STOCK'"
								>
									{{ $t("layout.default.header.dropdown.notifications.links.productNoStock") }}
								</span>

								<span
									v-else
								>
									{{ $t("layout.default.header.dropdown.notifications.links.default") }}
								</span>
							</RouterLink>

							<p
								v-if="notification.subtitle"
							>	
								{{ notification.subtitle }}
							</p>

							<p class="text-xs text-gray-500">
								{{ notification.createdAt.toString().split("T")[0] }}
							</p>
						</div>
					</DropdownMenuItem>

					<PrimaryButton
						v-if="canSeeMore"
						class="self-center"
						@click="getUserNotifications(++page, true)"
					>
						{{ $t("layout.default.header.dropdown.notifications.seeMore") }}
					</PrimaryButton>

					<span
						v-else-if="fullNotifications.length === 0"
						class="self-center text-sm text-gray-500"
					>
						{{ $t("layout.default.header.dropdown.notifications.noNotifications") }}
					</span>
				</div>

				<ScrollBar orientation="vertical" />
			</ScrollArea>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
