<script setup lang="ts">
import FlashMessage from "./FlashMessage.vue";
import { useFlash, type FlashContainerData, type FlashVisuals, defaultFlashVisuals } from "../Composables/flash.js";
import { VisualParam, type VisualParamDef } from "../Utils/VisualParam.js";

const props = defineProps<{
	flashContainerData?: FlashContainerData;
	visual?: VisualParamDef<FlashVisuals>;
}>();

const { flashContainerData } = useFlash();

const visual = new VisualParam<FlashVisuals>();
if (props.visual) visual.addParamDef(props.visual);
visual.addParamDef(defaultFlashVisuals);
const vis = visual.getAll();
</script>

<template>
<div :class="vis.containerClass">
	<FlashMessage
		v-for="item in (props.flashContainerData ?? flashContainerData).messages.value"
		:data="item"
		:key="item.id"
		:visuals="props.visual"
	/>
</div>
</template>

<style scoped>

</style>
