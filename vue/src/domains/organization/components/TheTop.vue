<script setup lang="ts">
import { cn } from "@/lib/utils";

interface Top {
  total: number;
  key: string;
}

interface Props {
  value: Top[];
  title: string;
}

const props = defineProps<Props>();

const maxTotal = Math.max(...props.value.map(item => item.total));

const topClassMapper: Record<number, string[]> = {
	0: ["bg-gold-gradient", "🏅"],
	1: ["bg-silver-gradient", "🥈"],
	2: ["bg-bronze-gradient", "🥉"],
	3: ["bg-copper-gradient"],
	4: ["bg-black-gradient"],
};

const getHeightByTotal = (total: number) => {
	const maxHeight = 380;
	const minHeight = 50;

	return `${(total / maxTotal) * (maxHeight - minHeight) + minHeight}px`;
};

const getBackgroundColor = (index: number) => {
	return topClassMapper[index][0];
};

const getPodiumIcon = (index: number) => {
	return topClassMapper[index][1] ?? "";
};

const formatCurrency = (total: number) => {
	return new Intl.NumberFormat("eur").format(total).toString();
};
</script>

<template>
	<section :class="cn('w-full h-full flex flex-col items-center space-y-6 bg-glassmorphism backdrop-blur', $attrs.class ?? '')">
		<h1 class="font-bold text-lg uppercase">
			{{ props.title }}
		</h1>

		<ul class="w-full max-h-full flex flex-row items-end justify-end space-x-3 h-full">
			<li
				v-for="(item, index) in props.value"
				:key="index"
				:class="cn('py-4 flex-1 vertical-writing border rotate-180 rounded-lg max-h-full font-semibold group cursor-pointer flex flex-row justify-between items-center', getBackgroundColor(index))"
				:style="{height: getHeightByTotal(item.total)}"
			>
				<h1 class="font-bold uppercase">
					{{ item.key }}
				</h1>

				<div class="opacity-0 flex flex-row space-x-4 items-center border-2 drop-shadow-lg justify-center group-hover:opacity-100 group-hover:duration-500 duration-500 py-3 px-2 bg-white rounded-md text-sm">
					<span class="transform flex rotate-90">{{ getPodiumIcon(index) }}</span>
					{{ formatCurrency(item.total) }}€
				</div>
			</li>
		</ul>
	</section>
</template>
