<script setup lang="ts">
import FlashMessage from "./FlashMessage.vue";
import {flash, FlashVisuals, defaultFlashVisuals} from "../Utils/flash";
import {VisualParam, VisualParamDef} from "../Utils/VisualParam.js";
import {ref} from "vue";

const props = defineProps<{
	visual?: VisualParamDef<FlashVisuals>;
}>();

const visual = new VisualParam<FlashVisuals>();
if (props.visual) visual.addParamDef(props.visual);
visual.addParamDef(defaultFlashVisuals);
const vis = visual.getAll();

const messages = ref([]);
let lastId = 0;
const add = (type, message) => {
	lastId++;
	messages.value.push({ message, type, id: lastId });
}
const remove = (id) => {
	messages.value = messages.value.filter(item => item.id !== id);
}
flash.registerAdd((type, message) => add(type, message));
</script>

<template>
<div :class="vis.containerClass">
	<FlashMessage
		v-for="message in messages"
		:id="message.id"
		:message="message.message"
		:type="message.type"
		@remove="remove"
		:key="message.id"
		:visuals="props.visual"
	/>
</div>
</template>

<style scoped>

</style>