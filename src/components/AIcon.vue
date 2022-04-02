<template>
	<svg class="icon" aria-hidden="true">
    <use :xlink:href="'#'+ name"></use>
	</svg>
</template>

<script setup>
const props = defineProps({
	name: String
})
</script>

<style scoped>
.icon {
	width: 1em;
	height: 1em;
	vertical-align: -0.15em;
	fill: currentColor;
	overflow: hidden;
}
</style>