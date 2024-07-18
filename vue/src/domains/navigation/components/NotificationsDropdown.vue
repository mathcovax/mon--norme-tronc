<script setup lang="ts">
import type { FullNotification } from "@/lib/utils";


const fullNotifications = ref<FullNotification[]>([]);
const page = ref(0);
const canSeeMore = ref(true);

function getUserNotifications(page: number) {
	return duploTo.enriched
		.get(
			"/user/notifications",
			{ query: { page } }
		)
		.info("userNotifications", (data) => {
			if (data.length < 10) {
				canSeeMore.value = false;
			}
			fullNotifications.value.push(...data);
		});
}

getUserNotifications(page.value);
</script>

<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<SecondaryButton
				size="icon"
				class="rounded-full"
			>
				<TheIcon
					:icon="fullNotifications.length ? 'bell-ring' : 'bell-outline'"
					size="2xl"
				/>
			</SecondaryButton>
		</DropdownMenuTrigger>

		<DropdownMenuContent
			align="end"
			class="w-full max-w-100"
		>
			<DropdownMenuLabel>
				{{ $t("layout.default.header.dropdown.notifications") }}
			</DropdownMenuLabel>

			<DropdownMenuSeparator />

			<ScrollArea class="h-96">
				<div class="flex flex-col gap-4 mb-6">
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
							<p class="font-bold">
								{{ notification.title }}
							</p>

							<RouterLink
								v-if="notification.redirect"
								:to="notification.redirect"
								class="text-blue-500"
							>
								Voir le produit
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
						@click="getUserNotifications(++page)"
					>
						Voir plus
					</PrimaryButton>
				</div>

				<ScrollBar orientation="vertical" />
			</ScrollArea>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
