<script setup lang="ts">
import type { Component } from "vue";
import { computed } from "vue";
import { ElementContent } from "../Utils/types.js";

const props = defineProps<{
	content: ElementContent;
}>();

const contentType = computed(() => {
	const c = props.content as any;
	if (typeof c === 'string') return 'text';
	else if (c.html) return 'html';
	else return 'component';
});
</script>

<template>
	<template v-if="contentType === 'text'">
		{{ content }}
	</template>
	<div v-if="contentType === 'html'" v-html="(content as any).html" />
	<component v-if="contentType === 'component'" :is="(content as any).component" v-bind="(content as any).componentProps" />
</template>
