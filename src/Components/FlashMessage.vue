<script setup lang="ts">
import {computed} from "vue";
import {flash, FlashVisuals, defaultFlashVisuals} from "../Utils/flash.js";
import {VisualParam, VisualParamDef} from "../Utils/VisualParam.js";
import {Timer} from "mu-js-utils/lib/Timer.js";

const props = defineProps<{
	message: string;
	type?: string;
	id: number;
	visuals?: VisualParamDef<FlashVisuals>;
}>();

const timeout = defineModel('timeout', { type: [Number, null] as any, default: 10000 });

const emit = defineEmits(['remove']);

const visual = new VisualParam<FlashVisuals>();
if (props.visuals) visual.addParamDef(props.visuals);
visual.addParamDef(defaultFlashVisuals);
const vis = visual.getAll();

const cssClasses = computed(() => {
	const resolvedType = flash.typeAlias[props.type] ?? props.type;
	return [
		vis.messageClass,
		(vis.messageTypePrefix ?? '') + resolvedType,
		timeout.value ? vis.timerClass : null,
	].flat().filter(Boolean);
});

const timer = new Timer(timeout.value, true);
timer.wait().then(() => { emit('remove', props.id); });

const stopTimer = () => {
	timer.stop();
	timeout.value = null;
}
</script>

<template>
<div :class="cssClasses" @click="stopTimer" :style="{'--flash-close-timeout': timeout + 'ms'}">
	{{ message }}
	<button type="button" :class="vis.closeBtnClass" @click="$emit('remove', props.id)" aria-label="Close"></button>
</div>
</template>

<style scoped>

</style>