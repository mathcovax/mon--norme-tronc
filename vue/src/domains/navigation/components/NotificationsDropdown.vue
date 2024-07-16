<script setup lang="ts">
const unreadNotifications = ref([
	{
		type: "newsletters",
		title: "Nouvelle newsletter",
		description: "Découvrez notre nouvelle newsletter",
		date: "2021-09-01T00:00:00.000Z"
	},
	{
		type: "productStock",
		title: "Produit en stock",
		description: "Le produit que vous attendiez est en stock",
		date: "2021-09-01T00:00:00.000Z"
	},
	{
		type: "productPromotion",
		title: "Promotion",
		description: "Profitez de notre promotion sur les produits de la rentrée",
		date: "2021-09-01T00:00:00.000Z"
	},
	{
		type: "newProducts",
		title: "Nouveaux produits",
		description: "Découvrez nos nouveaux produits",
		date: "2021-09-01T00:00:00.000Z"
	}
]);
</script>

<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<SecondaryButton
				size="icon"
				class="rounded-full"
			>
				<TheIcon
					:icon="unreadNotifications.length ? 'bell-ring' : 'bell-outline'"
					size="2xl"
				/>
			</SecondaryButton>
		</DropdownMenuTrigger>

		<DropdownMenuContent
			align="end"
			class="w-full max-w-80"
		>
			<DropdownMenuLabel>
				{{ $t("layout.default.header.dropdown.notifications") }}
			</DropdownMenuLabel>

			<DropdownMenuSeparator />

			<ScrollArea class="h-96">
				<DropdownMenuItem
					v-for="(notification, index) in unreadNotifications"
					:key="index"
					class="flex gap-4 items-center"
				>
					<TheIcon 
						:icon="notification.type === 'newsletters' ? 'email-newsletter' :
							notification.type === 'productStock' ? 'archive-plus' :
							notification.type === 'productPromotion' ? 'sale' : 'new-box'"
						size="2xl"
					/>

					<div>
						<p class="font-bold">
							{{ notification.title }}
						</p>

						<p>{{ notification.description }}</p>

						<p class="text-xs text-gray-500">
							{{ notification.date }}
						</p>
					</div>
				</DropdownMenuItem>

				<ScrollBar orientation="vertical" />
			</ScrollArea>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
