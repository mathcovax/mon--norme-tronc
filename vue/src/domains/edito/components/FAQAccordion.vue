<script setup lang="ts">
interface FAQItem {
	question: string;
	answer: string;
}

defineProps<{
	item: FAQItem;
}>();
</script>

<template>
	<TheAccordion
		type="single"
		collapsible
		class="w-full p-4 bg-card text-card-foreground shadow-sm border-0 rounded-md bg-gradient-to-b from-muted/50 to-muted"
	>
		<AccordionItem 
			class="border-b-0"
			:value="item.question"
		>
			<AccordionTrigger class="hover:no-underline">
				{{ item.question }}
			</AccordionTrigger>

			<AccordionContent class="pt-4 border-t">
				{{ item.answer }}
			</AccordionContent>
		</AccordionItem>
	</TheAccordion>
</template>
