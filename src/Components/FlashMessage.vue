<script setup lang="ts">
import {computed} from "vue";
import {flash, FlashVisuals, defaultFlashVisuals, type FlashContent} from "../Utils/flash.js";
import {VisualParam, VisualParamDef} from "../Utils/VisualParam.js";
import {Timer} from "mu-js-utils/lib/Timer.js";

const props = defineProps<{
	message: FlashContent;
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
const messageType = computed(() => {
  if (typeof props.message === 'string') return 'text';
  else if (props.message.html) return 'html';
  else return 'component';
});
</script>

<template>
<div :class="cssClasses" @click="stopTimer" :style="{'--flash-close-timeout': timeout + 'ms'}">
  <template v-if="messageType === 'text'">
	  {{ message }}
  </template>
  <template  v-if="messageType === 'html'" v-html="message.html" />
  <component v-if="messageType === 'component'" :is="props.message.component" v-bind="props.message.componentProps" />
	<button type="button" :class="vis.closeBtnClass" @click="$emit('remove', props.id)" aria-label="Close"></button>
</div>
</template>

<style scoped>

</style>