<script setup lang="ts">
interface FaqItem {
	question: string;
	answer: string;
}

defineProps<{
	item: FaqItem;
}>();
</script>

<template>
	<TheAccordion
		type="single"
		collapsible
		class="w-full"
	>
		<AccordionItem 
			class="border-b-0"
			value=""
		>
			<AccordionTrigger class="hover:no-underline	">
				{{ item.question }}
			</AccordionTrigger>

			<AccordionContent>
				{{ item.answer }}
			</AccordionContent>
		</AccordionItem>
	</TheAccordion>
</template>
