import { type Ref, ref} from 'vue';
import {VisualParamDef} from "../Utils/VisualParam.js";

const dialogs = ref<DialogApi[]>([]);
let lastDialogId: number = 1;

export type DialogVisuals = "containerClass"|"buttonClass"|"messageClass"|"buttonContainerClass"|"dialogClass";
const defaultVisual: VisualParamDef<DialogVisuals> = {
    buttonClass: null,
    messageClass:  ['dialog-message'],
    buttonContainerClass: ['dialog-buttons'],
    dialogClass: null,
};

export type DialogContainerData = {
    dialogs: Ref<DialogApi[]>
}

export const useDialog = () => {
    const dialogContainerData: DialogContainerData = {
        //@ts-ignore
        dialogs,
    };
    const addDialog = (
        message: string,
        buttons: ButtonDef[],
        visuals: VisualParamDef<DialogVisuals> = {},
    ) => {
        const dialog = new DialogApi(
            message,
            buttons,
            visuals,
        )
        dialogs.value.push(dialog);

        return dialog;
    };

    return {
        addDialog,
        dialogContainerData,
    };
}

const remove = (dialog: DialogApi) => {
    const index = dialogs.value.indexOf(dialog);
    if (index !== -1) dialogs.value.splice(index, 1);
}

export type ButtonDef = {
    label?: string;
    labelHtml?: string;
    value: any;
    cssClass?: string;
}

export class DialogApi {
    public id: number;
    private resolve: (value: any) => void;
    private cancelValue = null;
    constructor(
        public message: string,
        public buttons: ButtonDef[],
        public visuals: VisualParamDef<DialogVisuals>,
    ) {
        this.id = lastDialogId++;
    }

    public wait(): Promise<any> {
        return new Promise(resolve => this.resolve = resolve);
    }

    public onClick(button: ButtonDef) {
        this.resolve(button.value);
        this.remove();
    }

    public onCancel() {
        this.resolve(this.cancelValue);
        this.remove();
    }


    public remove() {
        remove(this);
    }
}

