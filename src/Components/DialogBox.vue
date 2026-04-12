<script setup lang="ts">
import {DialogApi, DialogVisuals} from '../Composables/dialog';
import { useTemplateRef, onMounted } from 'vue';
import {VisualParam, VisualParamDef} from "../Utils/VisualParam.js";

const props = defineProps<{
    data: DialogApi;
    visuals: VisualParamDef<DialogVisuals>;
}>();

const visual = new VisualParam<DialogVisuals>();
visual.addParamDef(props.visuals);
visual.addParamDef(props.data.visuals);
const vis = visual.getAll();

const dialogEl = useTemplateRef<HTMLDialogElement>('dialogEl');

onMounted(() => {
    dialogEl.value?.showModal();
});
</script>

<template>
    <dialog ref="dialogEl" @cancel="data.onCancel()" :class="vis.dialogClass">
        <div :class="vis.messageClass">{{ data.message }}</div>
        <div :class="vis.buttonContainerClass">
            <button
                v-for="button in data.buttons"
                :key="JSON.stringify(button.value)"
                :class="button.cssClass ?? vis.buttonClass"
                @click="data.onClick(button)"
            >
                {{ button.label }}
            </button>
        </div>
    </dialog>
</template>

<style scoped>
dialog {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.dialog-buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
}
</style>
