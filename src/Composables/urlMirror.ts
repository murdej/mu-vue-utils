import {reactive, Ref, ref, watch} from "vue";
import {useRouterUtil} from "./routerUtils.js";
import {Router} from "vue-router";

/**
 * Definition for custom serializer/deserializer pair.
 */
type SerializerDef = {
    /**
     * Function to serialize a value to a string for URL storage.
     */
    serializer: (value: any) => string|null,
    /**
     * Function to deserialize a string from the URL back to its original value.
     */
    deserializer: (value: string|null|undefined) => any
}

type InputSerializerDef = SerializerDef | typeof String | typeof Number | typeof Boolean | typeof Object | 'Integer' | 'Float' | 'String' | 'Boolean' | 'Number' | 'JSON';

/**
 * Maps the input definition type (string shortcut or SerializerDef) to the actual JavaScript type.
 * Note: Custom deserializer return type is approximated as 'any' unless a specific type is provided.
 */
type DeserializedType<T> =
    T extends 'String' | typeof String ? string | null :
        T extends 'Number' | 'Float' | 'Integer' | typeof Number ? number | null :
            T extends 'Boolean' | typeof Boolean ? boolean | null :
                T extends 'JSON' | typeof Object ? any | null : // Using 'any' for unknown JSON structure
                    T extends SerializerDef ? ReturnType<T['deserializer']> : // Use ReturnType if available
                        any;

/**
 * Maps the definition object structure (K: V) to the final reactive object structure (K: DeserializedType<V>).
 */
type MappedObjectDef<T extends Record<string, InputSerializerDef>> = {
    [K in keyof T]: DeserializedType<T[K]>
}

/**
 * Type definition for property configuration in createObject.
 * Allows for type shortcuts ('String', 'Number', 'Boolean'),
 * names of common DeSerializers ('string', 'int', 'JSON'), or a custom SerializerDef object.
 */
type ObjectDef = Record<string, InputSerializerDef>;

// ---------------------------------------------

/**
 * @param router The Vue Router instance.
 * @param route The current route object (if not using the default Vue Router context).
 * @returns A new instance of the UrlMirror class.
 */
export function useUrlMirror(
    router: Router|null = null,
    route: any|null = null,
): UrlMirror
{
    return new UrlMirror(router, route);
}

class UrlMirror {
    private router: Router|null;
    private route: any|null;
    public paramPrefix = '@';

    /**
     * Adds one or more reactive references to mirror a query parameter in the URL.
     *
     * @param queryParam The name of the query parameter, or a record mapping parameter names to Ref objects.
     * @param variable The reactive variable (Ref) to link (required if queryParam is a string).
     * @param serialize The (de)serialization definition. Defaults to 'string'.
     * @param patchMethod The method to update the URL ('replace' for history replacement, 'push' for new history entry). Defaults to 'replace'.
     * @returns The linked Ref object if a single parameter was passed, otherwise null.
     */
    public add(
        queryParam: string | Record<string, Ref<any>>,
        variable: Ref<any> | null = null,
        serialize: null | InputSerializerDef,
        patchMethod: 'replace' | 'push' = 'replace',
    ) {
        let singleVar = false;
        if (typeof queryParam === 'string' && variable === null) {
            singleVar = true;
            variable = ref(null);
        }
        const ru = useRouterUtil(this.router, this.route);

        const { serializer, deserializer } = this.prepareDSCallbacks(serialize ?? 'String');

        const items = (
            (typeof queryParam === 'string')
                ? [[queryParam, variable]]
                : Object.entries(queryParam)
        ) as unknown as [string, Ref][];

        for (let [propName, currentVariable] of items) {
            const field = propName.startsWith(this.paramPrefix) ? 'param' : 'query';
            const urlPropName = field === 'param' ? propName.substring(this.paramPrefix.length) : propName;
            (()=>{
                // The last value read from the URL to prevent unnecessary history patches when reading
                let lastUrlValue = ru.route[field][urlPropName];

                // Watch for changes in the URL and update the reactive variable
                watch(
                    () => ru.route[field][urlPropName],
                    (newUrlValue) => {
                        // Check if a real change occurred in the URL and that it wasn't the last value we wrote
                        if (newUrlValue !== lastUrlValue) {
                            currentVariable.value = deserializer
                                ? deserializer(newUrlValue)
                                : newUrlValue;
                        }
                    }
                );

                // Watch for changes in the reactive variable and update the URL
                watch(
                    currentVariable,
                    () => {
                        const urlValue = serializer
                            ? serializer(currentVariable.value)
                            : currentVariable.value;

                        lastUrlValue = urlValue; // Store the value we are writing

                        // Apply change to the URL
                        const newQuery = {[urlPropName]: urlValue};
                        switch (patchMethod) {
                            case 'replace':
                                ru.patchRouteR(
                                    field === 'query' ? newQuery : {},
                                    field === 'param' ? newQuery : {},
                                );
                                break;
                            case 'push':
                                ru.patchRouteP(
                                    field === 'query' ? newQuery : {},
                                    field === 'param' ? newQuery : {},
                                );
                                break;
                        }
                    },
                    {deep: true}, // Deep watch for objects
                );

                // Initial synchronization: URL to variable
                if (typeof ru.route[field][urlPropName] !== 'undefined') {
                    currentVariable.value = deserializer
                        ? deserializer(ru.route[field][urlPropName])
                        : ru.route[field][urlPropName];
                } else {
                    // Initial synchronization: variable to URL, if not defined in URL
                    const urlValue = serializer
                        ? serializer(currentVariable.value)
                        : currentVariable.value;
                    if (urlValue !== ru.route[field][urlPropName]) ru.patchRouteR(
                        field === 'query' ? {[propName]: urlValue} : {},
                        field === 'param' ? {[propName]: urlValue} : {},
                    );
                }
            })();
        }

        return singleVar ? variable : null;
    }

    /**
     * Prepares the SerializerDef object (serializer and deserializer functions) based on
     * a type shortcut ('String', 'Number', 'Boolean') or a common serializer name.
     * * @param def The type shortcut, common serializer name, or custom SerializerDef object.
     * @returns The object containing concrete serializer and deserializer functions.
     */
    private prepareDSCallbacks(def: InputSerializerDef): SerializerDef {
        if (def === String) def = 'String';
        else if (def === Boolean) def = 'Boolean';
        else if (def === Number) def = 'Number';
        else if (def === Object) def = 'JSON';

        if (typeof def === 'string') {
            switch (def) {
                case 'JSON': return {
                    serializer: (v) => v === null || typeof v === 'undefined' ? null : JSON.stringify(v),
                    deserializer: (s) => s === null || typeof s === 'undefined' ? null : JSON.parse(s),
                };
                case 'Integer': return {
                    serializer: (v) => typeof v === 'number'
                        ? (Number.isNaN(v) ? null : v.toString())
                        : (v === null || typeof v === 'undefined' ? null : String(v)),
                    deserializer: (s) => s === null || typeof s === 'undefined' ? null : parseInt(s),
                };
                case 'Number':
                case 'Float': return {
                    serializer: (v) => typeof v === 'number'
                        ? (Number.isNaN(v) ? null : v.toString())
                        : (v === null || typeof v === 'undefined' ? null : String(v)),
                    deserializer: (s) => s === null || typeof s === 'undefined' ? null : parseFloat(s),
                };
                case 'String': return {
                    deserializer: (v) => v === null || typeof v === 'undefined' ? null : String(v),
                    serializer: (s) => s === null || typeof s === 'undefined' ? null : String(s),
                };
                case 'Boolean':
                    return {
                        serializer: (v: boolean|null) => v === true ? '1' : (v === false ? '0' : null),
                        deserializer: (s: string|null|undefined) => s === '1' ? true : (s === '0' ? false : null),
                    };
                default:
                    console.warn(`Unknown serializer definition: ${def}. Falling back to 'string'.`);
                    return {
                        deserializer: (v) => v === null || typeof v === 'undefined' ? null : String(v),
                        serializer: (s) => s === null || typeof s === 'undefined' ? null : String(s),
                    };
            }
        }

        // @ts-ignore
        return def;
    }

    /**
     * Creates a single reactive Ref linked to a URL query parameter.
     *
     * @param queryParam The name of the query parameter.
     * @param serialize The (de)serialization method to use (name, function, or null). Defaults to 'string'.
     * @param patchMethod The method to update the URL ('replace' or 'push'). Defaults to 'replace'.
     * @returns A reactive Ref object linked to the query parameter.
     */
    public create(
        queryParam: string,
        serialize: InputSerializerDef,
        patchMethod: 'replace' | 'push' = 'replace',
    ): Ref<any>
    {
        return this.add(
            queryParam,
            null,
            serialize,
            patchMethod,
        ) as Ref<any>;
    }

    /**
     * Creates a reactive object whose properties are synchronized with URL query parameters.
     *
     * @template TDef The type of the input definitions object.
     * @param definitions Property definitions in the format { propName: type | {serializer, deserializer}, ... }
     * @param patchMethod The method to update the URL ('replace' or 'push'). Defaults to 'replace'.
     * @returns A reactive object whose type is mapped from the input definitions, ensuring correct keys and types.
     */
    public createObject<TDef extends ObjectDef>(
        definitions: TDef,
        patchMethod: 'replace' | 'push' | ((name: keyof TDef, value: any) => 'replace' | 'push') = 'replace',
    ): MappedObjectDef<TDef> {
        // Create an empty reactive object that will serve as the mirror
        const reactiveObject = reactive({}) as MappedObjectDef<TDef>;
        const ru = useRouterUtil(this.router, this.route);

        // Map to track the last serialized URL values to prevent redundant patches
        const lastUrlValues: Record<string, any> = {};

        // Iterate over all defined properties of the object
        for (const [propName, propDef] of Object.entries(definitions)) {
            // Get the specific serialization and deserialization functions for the property
            const field = propName.startsWith(this.paramPrefix) ? 'param' : 'query';
            const urlPropName = field === 'param' ? propName.substring(this.paramPrefix.length) : propName;
            const { serializer, deserializer } = this.prepareDSCallbacks(propDef);

            // Set the initial value in the reactive object (deserializer handles null/undefined)
            reactiveObject[propName as keyof MappedObjectDef<TDef>] = deserializer(undefined);

            // 1. Watch for changes in the URL and update the reactive object
            watch(
                () => ru.route[field][urlPropName],
                (newUrlValue) => {
                    // Check if the URL value is different from the last value we wrote
                    if (newUrlValue !== lastUrlValues[propName]) {
                        // Deserialize and set the value in the reactive object
                        reactiveObject[propName as keyof MappedObjectDef<TDef>] = deserializer(newUrlValue);
                    }
                }
            );

            // 2. Watch for changes in the reactive object and update the URL
            watch(
                () => reactiveObject[propName as keyof MappedObjectDef<TDef>],
                (newPropValue) => {
                    // Serializace hodnoty
                    const urlValue = serializer(newPropValue);

                    lastUrlValues[propName] = urlValue; // Store the value we are writing

                    // Update the URL
                    const newQuery = {[urlPropName]: urlValue};

                    const currentPatchMethod = (typeof patchMethod === 'function')
                        ? patchMethod(propName, newPropValue)
                        : patchMethod;

                    switch (currentPatchMethod) {
                        case 'replace':
                            ru.patchRouteR(
                                field === 'query' ? newQuery : {},
                                field === 'param' ? newQuery : {},
                            );
                            break;
                        case 'push':
                            ru.patchRouteP(
                                field === 'query' ? newQuery : {},
                                field === 'param' ? newQuery : {},
                            );
                            break;
                    }
                },
                {deep: true} // Deep watch is important for reactive objects
            );

            // 3. Initial synchronization
            const urlQueryValue = ru.route[field][urlPropName];

            if (typeof urlQueryValue !== 'undefined' && urlQueryValue !== null) {
                // Initial value from URL: Deserialize and set to the object
                const initialValue = deserializer(urlQueryValue as string);
                reactiveObject[propName as keyof MappedObjectDef<TDef>] = initialValue;
                // Store the serialized value from the URL for checking
                lastUrlValues[propName] = urlQueryValue;
            } else {
                // Initial value from object (already set by deserializer): Serialize and set to URL, if non-null
                const urlValue = serializer(reactiveObject[propName as keyof MappedObjectDef<TDef>]);

                // Update URL only if the serialized value is not null
                if (urlValue !== null) {
                    ru.patchRouteR(
                        field === 'query' ? { [urlPropName]: urlValue} : {},
                        field === 'param' ? { [urlPropName]: urlValue} : {},
                    );
                    lastUrlValues[propName] = urlValue;
                }
            }
        }

        // Return the reactive object
        return reactiveObject;
    }

    /**
     * @param router The Vue Router instance.
     * @param route The current route object.
     */
    constructor(
        router: Router|null = null,
        route: any|null = null,
    ) {
        this.router = router;
        this.route = route;
    }
}