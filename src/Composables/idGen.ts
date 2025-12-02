import { getCurrentInstance } from 'vue';

export function useIdGen() {
    const instance = getCurrentInstance();
    return (name:string) => instance.uid + '_' + name;
}