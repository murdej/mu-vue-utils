import {Ref, watch} from "vue";
import {useRouterUtil} from "./routerUtils";

export function useUrlMirror(
    queryParam: string | Record<string, Ref<any>>,
    variable: Ref<any> | null = null,
    serializer: null | 'JSON' | ((value: any) => string) = null,
    deserializer: null | 'JSON' | ((value: string) => any) = null,
    patchMethod: 'replace' | 'push' = 'replace',
) {
    if (typeof queryParam === 'string' && variable === null) throw Error('variable must be Ref');
    const ru = useRouterUtil();

    const currentSerializer = serializer === 'JSON' ? (val) => JSON.stringify(val) : serializer;
    const currentDeserializer = deserializer === 'JSON' ? (val) => JSON.parse(val) : deserializer;

    const items = (
        (typeof queryParam === 'string')
            ? [[queryParam, variable]]
            : Object.entries(queryParam)
    ) as unknown as [string, Ref][];

    for (const [currentQueryParam, currentVariable] of items) {
        (()=>{

            let lastUValue = ru.route.query[currentQueryParam];
            watch(
                ru.route,// .query[currentQueryParam],
                () => {
                    if (lastUValue !== ru.route.query[currentQueryParam]) {
                        currentVariable.value = currentDeserializer ? currentDeserializer(ru.route.query[currentQueryParam]) : ru.route.query[currentQueryParam];
                    }
                }
            );

            watch(
                currentVariable,
                () => {
                    const uValue = currentSerializer ? currentSerializer(currentVariable.value) : currentVariable.value;
                    lastUValue = uValue;
                    switch (patchMethod) {
                        case 'replace':
                            ru.patchRouteR({[currentQueryParam]: uValue});
                            break;
                        case 'push':
                            ru.patchRouteP({[currentQueryParam]: uValue});
                            break;
                    }
                },
                {deep: true},
            );

            if (typeof ru.route.query[currentQueryParam] !== 'undefined') {
                currentVariable.value = currentDeserializer ? currentDeserializer(ru.route.query[currentQueryParam]) : ru.route.query[currentQueryParam];
            } else {
                const uValue = currentSerializer ? currentSerializer(currentVariable.value) : currentVariable.value;
                if (uValue !== ru.route.query[currentQueryParam]) ru.patchRouteR({[currentQueryParam]: uValue});
            }
        })();
    }
}

