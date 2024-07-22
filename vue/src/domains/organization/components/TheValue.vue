<script setup lang="tsx">
import { cn } from "@/lib/utils";

interface Props {
  total: number;
  key: string;
}

const props = defineProps<{ data: Props }>();

const formatCurrency = (total: number) => {
	return new Intl.NumberFormat("eur").format(total).toString();
};
</script>

<template>
	<section :class="cn('w-full p-2 h-full flex flex-col space-y-1.5 justify-center', $attrs.class ?? '')">
		<div class="w-full flex flex-row items-center justify-between">
			<h3 class="font-semibold">
				{{ props.data.key }}
			</h3>

			<TheIcon icon="currency-eur" />
		</div>


		<h1 class="font-bold text-4xl tracking-tight">
			{{ formatCurrency(props.data.total) }}€
		</h1>
	</section>
</template>
