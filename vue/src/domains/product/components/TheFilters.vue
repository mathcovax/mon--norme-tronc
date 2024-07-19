<script setup lang="ts">
import type { ComputedFilter, QueryFilters } from "@/lib/utils";
import ToggleFilter from "./ToggleFilter.vue";
import CheckboxFilter from "./CheckboxFilter.vue";
import RangeFilter from "./RangeFilter.vue";
import RadioFilter from "./RadioFilter.vue";
defineProps<{
	filters: ComputedFilter[];
}>();

const filtersValue = defineModel<
	Record<string, QueryFilters[keyof QueryFilters]>
>(
	"filtersValue",
	{ required: true }
);

</script>

<template>
	<TheAccordion
		type="multiple"
		collapsible
		class="w-full p-4 border-2 rounded-lg border-muted"
	>
		<template
			v-for="filter in filters"
			:key="filter.name"
		>
			<div
				v-if="filter.type === 'TOGGLE'"
				class="flex justify-between gap-4 py-4 border-b"
			>
				<h1 class="font-medium">
					{{ $t(`filters.name.	${filter.name}`) }}
				</h1>

				<ToggleFilter
					:name="filter.name"
					:quantity="filter.quantity"
					v-model:filter-value="(filtersValue[filter.name] as 'true' | undefined)"
				/>
			</div>

			<AccordionItem 
				v-else-if="filter.type === 'CHECKBOX'"
				:value="filter.name"
			>
				<AccordionTrigger class="hover:no-underline">
					{{ $t(`filters.name.${filter.name}`) }}
				</AccordionTrigger>
				
				<AccordionContent>
					<CheckboxFilter
						:name="filter.name"
						:values="filter.values"
						v-model:filter-value="(filtersValue[filter.name] as string[] | undefined)"
					/>
				</AccordionContent>
			</AccordionItem>

			<div
				v-else-if="filter.type === 'RANGE'"
				class="py-4"
			>
				<h1 class="font-medium">
					{{ $t(`filters.name.${filter.name}`) }}
				</h1>

				<RangeFilter
					:name="filter.name"
					:min="filter.min"
					:max="filter.max"
					v-model:filter-value="(filtersValue[filter.name] as [number, number] | undefined)"
				/>
			</div>

			<AccordionItem 
				v-else-if="filter.type === 'RADIO'"
				:value="filter.name"
			>
				<AccordionTrigger class="hover:no-underline">
					{{ $t(`filters.name.${filter.name}`) }}
				</AccordionTrigger>

				<AccordionContent>
					<RadioFilter
						:name="filter.name"
						:values="filter.values"
						v-model:filter-value="(filtersValue[filter.name] as string | undefined)"
					/>
				</AccordionContent>
			</AccordionItem>
		</template>
	</TheAccordion>
</template>
