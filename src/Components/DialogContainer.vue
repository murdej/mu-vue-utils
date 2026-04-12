<script setup lang="ts">
import {DialogApi, DialogContainerData, DialogVisuals, useDialog} from "../Composables/dialog.js";
import DialogBox from "./DialogBox.vue";
import {VisualParamDef} from "../Utils/VisualParam.js";

const props = defineProps<{
  dialogContainerData: DialogContainerData,
  visual?: VisualParamDef<DialogVisuals>,
}>();

const { dialogContainerData } = useDialog();
console.log(props.dialogContainerData.dialogs);
console.log(dialogContainerData.dialogs);
</script>

<template>
<DialogBox
    v-for="dialog of props.dialogContainerData.dialogs.value ?? dialogContainerData.dialogs.value"
    :data="dialog"
    :key="dialog.id"
    :visuals="props.visual"
/>
</template>

<style scoped>

</style>