<script setup>
import {computed, ref} from "vue";
import {flash} from "../Utils/flash.ts";
import {Timer} from "mu-js-utils/lib/Timer.js";

const props = defineProps({
	message: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		default: 'info',
	},
	id: {
		type: Number,
		required: true,
	},
});
const timeout = defineModel(
	'timeout',
	{
		type: [ Number, null ],
		default: 10000,
	}
)

const emit = defineEmits(['remove']);

const cssClasses = computed(
	() => flash.messageCssClasses(props.type, !!props.timeout),
);

const timer = new Timer(timeout.value, true);
timer.wait().then(() => { emit('remove', props.id); });

const stopTimer = () => {
	timer.stop();
	timeout.value = null;
}
</script>

<template>
<div :class="cssClasses" @click="stopTimer" :style="{'--flash-close-timeout': timeout + 'ms' }">
	{{message}}
	<button type="button" class="btn-close" @click="$emit('remove', props.id)" aria-label="Close"></button>
</div>
</template>

<style scoped>

</style>