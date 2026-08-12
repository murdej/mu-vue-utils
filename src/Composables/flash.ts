import { markRaw, type Ref, ref } from 'vue';
import { type VisualParamDef } from '../Utils/VisualParam';
import { ElementContent } from "../Utils/types";

export type FlashVisuals = "containerClass" | "itemClass" | "messageClass" | "messageTypePrefix" | "timerClass" | "closeBtnClass" | "closeBtnText";
export type FlashMessageType = 'info'|'error'|string;

export const defaultFlashVisuals: VisualParamDef<FlashVisuals> = {
    containerClass: ['flash-container'],
    messageClass: ['alert'],
    messageTypePrefix: 'alert-',
    timerClass: 'flash-close-timer',
    closeBtnClass: 'btn-close',
    closeBtnText: '×',
};

const messages = ref<FlashApi[]>([]);
let lastFlashId = 1;

export type FlashContainerData = {
    messages: Ref<FlashApi[]>;
};

export const useFlash = () => {
    const flashContainerData: FlashContainerData = {
        // @ts-ignore
        messages,
    };

    const addFlash = (
        message: ElementContent,
        type: FlashMessageType = 'info',
        timeout: number = 10000,
        visuals: VisualParamDef<FlashVisuals> = {},
    ) => {
        if (typeof message === 'object' && 'component' in message) {
            message = {
                ...message,
                component: markRaw(message.component),
            }
        }
        const item = new FlashApi(message, type, timeout, visuals);
        messages.value.push(item);
        return item;
    };

    return { addFlash, flashContainerData };
};

const remove = (item: FlashApi) => {
    const index = messages.value.indexOf(item);
    if (index !== -1) messages.value.splice(index, 1);
};

export class FlashApi {
    public id: number;
    constructor(
        public message: ElementContent,
        public type: FlashMessageType = 'info',
        public timeout: number = 10000,
        public visuals: VisualParamDef<FlashVisuals> = {},
    ) {
        this.id = lastFlashId++;
    }

    public remove() {
        remove(this);
    }
}
