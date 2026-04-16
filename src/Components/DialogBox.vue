<script setup lang="ts">
import {DialogApi, dialogDefaultVisual, DialogVisuals} from '../Composables/dialog';
import {useTemplateRef, onMounted, unref, toRaw} from 'vue';
import {VisualParam, VisualParamDef} from "../Utils/VisualParam.js";

const props = defineProps<{
    data: DialogApi;
    visuals: VisualParamDef<DialogVisuals>;
}>();

const visual = new VisualParam<DialogVisuals>();
visual.addParamDef(dialogDefaultVisual);
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
        <button :class="vis.closeButtonClass" @click="data.onClose()">
            <span v-if="vis.closeButtonLabelHtml" v-html="vis.closeButtonLabelHtml" />
            <template v-else>{{ vis.closeButtonLabel }}</template>
        </button>
        <div :class="vis.messageClass">{{ data.message }}</div>
        <div :class="vis.buttonContainerClass">
            <button
                v-for="button in data.buttons"
                :key="JSON.stringify(button.value)"
                :class="button.cssClass ?? vis.buttonClass"
                @click="data.onClick(toRaw(button))"
            >
                <span v-if="button.labelHtml" v-html="button.labelHtml" />
                <template v-else>{{ button.label }}</template>
            </button>
        </div>
    </dialog>
</template>

<style scoped>
dialog {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
}

.dialog-buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
}

.dialog-close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
}
</style>
