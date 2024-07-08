<script setup lang="ts">
import { ThePagination, PaginationList, PaginationListItem } from "@/components/ui/pagination";

const emit = defineEmits<{
	update: [value: number]
}>();

defineProps<{
	total: number,
	currentPage: number,
	productPerPage: number
}>();

const update = (page: number) => {
	emit("update", page);
};
</script>

<template>
	<ThePagination
		v-slot="{ page }"
		:total="total * 10 / productPerPage"
		:sibling-count="1"
		show-edges
		:page="currentPage"
		@update:page="update"
		class="flex justify-center my-8"
	>
		<PaginationList
			v-slot="{ items }"
			class="flex items-center gap-1"
		>
			<PaginationFirst />

			<PaginationPrev />

			<template v-for="(item, index) in items">
				<PaginationListItem
					v-if="item.type === 'page'"
					:key="index"
					:value="item.value"
					as-child
				>
					<TheButton
						class="w-10 h-10 p-0"
						:variant="item.value === page ? 'default' : 'outline'"
					>
						{{ item.value }}
					</TheButton>
				</PaginationListItem>

				<PaginationEllipsis
					v-else
					:key="item.type"
					:index="index"
				/>
			</template>

			<PaginationNext />

			<PaginationLast />
		</PaginationList>
	</ThePagination>
</template>
