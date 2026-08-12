<script setup lang="ts">
import {computed, ref} from "vue";
import { type FlashApi, type FlashVisuals, defaultFlashVisuals } from "../Composables/flash.js";
import {VisualParam, type VisualParamDef} from "../Utils/VisualParam.js";
import {Timer} from "mu-js-utils/src/Timer.ts";

const props = defineProps<{
	data: FlashApi;
	visuals?: VisualParamDef<FlashVisuals>;
}>();

const timeout = ref<number | null>(props.data.timeout);

const visual = new VisualParam<FlashVisuals>();
visual.addParamDef(defaultFlashVisuals);
if (props.visuals) visual.addParamDef(props.visuals);
const vis = visual.getAll();

const cssClasses = computed(() => {
	const resolvedType = props.data.type;
	return [
		vis.itemClass,
		(vis.messageTypePrefix ?? '') + resolvedType,
		timeout.value ? vis.timerClass : null,
	].flat().filter(Boolean);
});

const timer = new Timer(timeout.value, true);
timer.wait().then(() => { props.data.remove(); });

const stopTimer = () => {
	timer.stop();
	timeout.value = null;
};

const messageType = computed(() => {
  const msg = props.data.message as any;
  if (typeof msg === 'string') return 'text';
  else if (msg.html) return 'html';
  else return 'component';
});
</script>


<template>
<div :class="cssClasses" @click="stopTimer" :style="{'--flash-close-timeout': timeout + 'ms'}">
  <div :class="vis.messageClass">
    <template v-if="messageType === 'text'">
      {{ data.message }}
    </template>
    <div v-if="messageType === 'html'" v-html="(data.message as any).html" />
    <component v-if="messageType === 'component'" :is="(data.message as any).component" v-bind="(data.message as any).componentProps" />
  </div>
	<button type="button" :class="vis.closeBtnClass" @click.stop="data.remove()" aria-label="Close">{{ vis.closeBtnText }}</button>
</div>
</template>

<style scoped>

</style>
