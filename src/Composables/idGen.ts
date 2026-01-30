import {computed, ComputedRef, getCurrentInstance, isRef, nextTick, ref, type Ref} from 'vue';

export function useIdGen(options: Partial<UseIdGenOptions> = {}) {
    options = {
        prefixCompound: '_ic_',
        prefixGenerated: '_ig_',
        instanceUid: null,
        ...options,
    };
    if (!options.instanceUid) {
        const instance = getCurrentInstance();
        options.instanceUid = instance?.uid.toString() ?? Math.random().toString(36).slice(2, 9);
    }

    return (target: string | Ref<HTMLElement | null>): string|ComputedRef<string> => {
        if (typeof target === 'string') {
            return `${options.prefixCompound}${options.instanceUid}_${target}`;
        }

        if (target instanceof HTMLElement) {
            if (target.id) {
                return target.id;
                if ((target as any).__vnode?.dynamicProps.includes('id')) {
                    return (async () => {
                        nextTick();
                        return target.id;
                    })();
                } else return target.id;
            }

            const generatedId = `${options.prefixGenerated}${options.instanceUid}_${Math.random().toString(36).slice(2, 9)}`;
            target.id = generatedId;
            return generatedId;
        }

        return '';
    };
}

export type UseIdGenOptions = {
    prefixCompound: string;
    prefixGenerated: string;
    instanceUid: string;
}