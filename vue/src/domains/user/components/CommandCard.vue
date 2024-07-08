<script setup lang="ts">
import type { Command, FullCommand } from "@/lib/utils";

const $pt = usePageTranslate();
const { PRODUCT_PAGE, USER_COMMAND } = routerPageName;

interface Props {
	command: Command[number] | FullCommand
}
defineProps<Props>();

function getColorByStatus(status: string) {
	switch (status) {
	case "IN_PROGRESS":
		return "bg-yellow-500";
	case "WAITING_PAYMENT":
		return "bg-blue-500";
	case "DONE":
		return "bg-green-500";
	case "CANCELED":
		return "bg-red-500";
	default:
		return "bg-slate-500";
	}
}
</script>
<template>
	<TheCard class="text-sm">
		<CardHeader class="text-gray-600 bg-gray-100 border-b rounded-t-lg">
			<div class="flex justify-between gap-2">
				<div class="flex gap-6">
					<div class="flex flex-col gap-1">
						<h2>{{ $pt("command.label.date") }}</h2>

						<span>{{ command.createdDate }}</span>
					</div>

					<div class="flex flex-col gap-1">
						<h2>{{ $pt("command.label.total") }}</h2>
 
						<span>{{ $pt("command.price", { value: command.price }) }}</span>
					</div>

					<div class="flex flex-col gap-1">
						<h2>{{ $pt("command.label.address") }}</h2>

						<div class="flex flex-col">
							<span>{{ command.lastname + " " + command.firstname }}</span>

							<span>{{ command.deliveryAddress }}</span>
						</div>
					</div>
				</div>

				<div class="flex flex-col items-end gap-2">
					<div class="flex gap-2">
						<h2>{{ $pt("command.label.commandNumber") }}</h2>

						<span>{{ command.id }}</span>
					</div>

					<div class="flex items-center gap-2">
						<RouterLink
							:to="{ name: USER_COMMAND, params: { commandId: command.id }}"
							class="text-gray-700 hover:text-black"
						>
							<span>Afficher les détails de la commande</span>
						</RouterLink>

						<span class="text-gray-300">|</span>

						<span
							class="p-2 text-white border rounded-lg"
							:class="getColorByStatus(command.status)"
						>{{ $pt(`command.status.${command.status}`).toUpperCase() }}</span>
					</div>
				</div>
			</div>
		</CardHeader>

		<CardContent class="flex flex-col gap-6 pt-6">
			<div
				class="flex items-start gap-4"
				v-for="item in command.items"
				:key="item.productSheetName"
			>
				<img
					:src="item.productSheetFirstImageUrl"
					alt="placeholder"
					width="64"
					height="64"
					class="object-cover rounded-md aspect-square"
				>

				<div class="flex flex-col gap-1">
					<h2 class="font-bold">
						{{ item.productSheetName }}
					</h2>

					<span>{{ $pt("command.quantity", { value: item.quantity }) }}</span>

					<RouterLink :to="{name: PRODUCT_PAGE, params: {productSheetId: item.productSheetId}}">
						<span class="flex items-center w-40 gap-1 border rounded-lg">
							<TheIcon
								size="xl"
								icon="rotate-right"
							/>
							{{ $pt("command.label.reBuy") }}
						</span>
					</RouterLink>
				</div>
			</div>
		</CardContent>
	</TheCard>
</template>
