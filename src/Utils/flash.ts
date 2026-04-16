import {VisualParamDef} from "./VisualParam.js";
import type {Component, ConcreteComponent} from 'vue';

export type FlashVisuals = "containerClass" | "messageClass" | "messageTypePrefix" | "timerClass" | "closeBtnClass";

export type FlashContent = string
    | { html: string }
    | {
        component: Component | ConcreteComponent;
        componentProps?: Record<string, any>;
    };

export const defaultFlashVisuals: VisualParamDef<FlashVisuals> = {
    containerClass: ['flash-container'],
    messageClass: ['alert'],
    messageTypePrefix: 'alert-',
    timerClass: 'flash-close-timer',
    closeBtnClass: 'btn-close',
};

export class Flash {
    private addCallback: (type: FlashMessageType, message: FlashContent) => void;

    public typeAlias: Record<FlashMessageType, string> = {
        info: 'primary',
        error: 'danger',
    };

    public registerAdd(addCallback) {
        this.addCallback = addCallback;
        for (const [type, message] of this.buffer) {
            this.add(type, message);
        }
    }

    private buffer = [];
    public add(type: FlashMessageType, message: FlashContent) {
        if (this.addCallback) {
            this.addCallback(type, message);
        } else {
            this.buffer.push([type, message]);
        }
    }
}

export type FlashMessageType = 'info'|'error'|string;

export const flash = new Flash();
