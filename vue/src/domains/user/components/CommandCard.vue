<script setup lang="ts">
import type { FullCommand, CommandStatus } from "@/lib/utils";
import ProductCommand from "./ProductCommand.vue";

const $pt = usePageTranslate();
const { USER_COMMAND } = routerPageName;

interface Props {
	command: FullCommand
}
defineProps<Props>();

const colorsMapper: Record<CommandStatus, string> = {
	"CANCELED": "bg-red-500",
	"WAITING_PAYMENT": "bg-blue-500",
	"IN_PROGRESS": "bg-yellow-500",
	"IN_DELIVERY": "bg-yellow-500",
	"DONE": "bg-green-500"
};
</script>
<template>
	<TheCard>
		<CardHeader class="text-sm text-gray-600 bg-gray-100 border-b rounded-t-lg">
			<div class="flex justify-between gap-2">
				<div class="flex gap-6">
					<div class="flex flex-col gap-1">
						<h2 class="font-bold">
							{{ $pt("command.label.date") }}
						</h2>

						<span>{{ new Date(command.createdDate).toLocaleDateString() }}</span>
					</div>

					<div class="flex flex-col gap-1">
						<h2 class="font-bold">
							{{ $pt("command.label.total") }}
						</h2>
 
						<span>{{ $pt("command.price", { value: command.price }) }}</span>
					</div>

					<div class="flex flex-col gap-1">
						<h2 class="font-bold">
							{{ $pt("command.label.address") }}
						</h2>

						<div class="flex flex-col">
							<span>{{ command.lastname + " " + command.firstname }}</span>

							<span>{{ command.deliveryAddress }}</span>
						</div>
					</div>
				</div>

				<div class="flex flex-col items-end gap-2">
					<div class="flex gap-2">
						<h2 class="font-bold">
							{{ $pt("command.label.commandNumber") }}
						</h2>

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
							:class="colorsMapper[command.status]"
						>{{ $t(`commandStatus.${command.status}`).toUpperCase() }}</span>
					</div>
				</div>
			</div>
		</CardHeader>

		<CardContent class="flex flex-col gap-6 pt-6">
			<ProductCommand
				v-for="product in command.items"
				:product="product"
				:key="product.productSheetId"
			/>
		</CardContent>
	</TheCard>
</template>
