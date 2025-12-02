<script setup>
import FlashMessage from "./FlashMessage.vue";
import {flash} from "../Utils/flash.ts";
import {ref} from "vue";

const messages = ref([]);
let lastId = 0;
const add = (type, message) => {
	lastId++;
	messages.value.push({
		message, type, id: lastId
	});
}
const remove = (id) => {
	messages.value = messages.value.filter(item => item.id !== id);
}
flash.registerAdd((type, message) => add(type, message));
</script>

<template>
<div :class="flash.containerCssClasses()">
	<FlashMessage v-for="message in messages" :id="message.id" :message="message.message" :type="message.type" @remove="remove" :key="message.id" />
</div>
</template>

<style scoped>

</style>