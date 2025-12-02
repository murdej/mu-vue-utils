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

    public messageCssClasses: ((type: string, isTimeout: boolean)=>void) = (type, isTimeout) => [
        'alert',
        'alert-' + (this.typeAlias[type] ?? type),
        isTimeout ? 'flash-close-timer' : null
    ];

    public containerCssClasses: (()=>string[]|Record<string,boolean>) = () => [ 'flash-container' ];
}

export type FlashMessageType = 'info'|'error'|string;

export const flash = new Flash();
