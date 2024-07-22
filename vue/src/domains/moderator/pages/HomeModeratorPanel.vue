<script setup lang="ts">
const $pt = usePageTranslate();
</script>

<template>
	<section class="grow flex justify-center items-center">
		<h1 class="mb-12 text-2xl font-semibold">
			{{ $pt("title") }}
		</h1>
	</section>
</template>
