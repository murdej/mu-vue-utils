import {VisualParamDef} from "./VisualParam.js";

export type FlashVisuals = "containerClass" | "messageClass" | "messageTypePrefix" | "timerClass" | "closeBtnClass";

export const defaultFlashVisuals: VisualParamDef<FlashVisuals> = {
    containerClass: ['flash-container'],
    messageClass: ['alert'],
    messageTypePrefix: 'alert-',
    timerClass: 'flash-close-timer',
    closeBtnClass: 'btn-close',
};

export class Flash {
    private addCallback: (type: FlashMessageType, message: string) => void;

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
    public add(type: FlashMessageType, message: string) {
        if (this.addCallback) {
            this.addCallback(type, message);
        } else {
            this.buffer.push([type, message]);
        }
    }
}

export type FlashMessageType = 'info'|'error'|string;

export const flash = new Flash();
