import {Router, useRoute, useRouter} from "vue-router";
export function useRouterUtil(router: Router = null, route = null): RouterUtil
{
    return new RouterUtil(
        router ?? useRouter(),
        route ?? useRoute(),
    );
}

const symbolKeepList = Symbol();

type PatchFields = {
    [symbolKeepList]?: string[],
    [other: string]: UrlValue,
};

export type UrlValue = string|number|null;

/**
 * Utility class to simplify route parameter manipulation.
 *
 * @export
 * @class RouterUtil
 */
export class RouterUtil {
    /**
     * Initializes the router utility with the current router instance and route object.
     *
     * @param {Router} router - The active router instance (e.g., Vue Router instance).
     * @param {any} route - The current route object containing name, params, and query properties.
     */
    constructor(
        public router: Router,
        public route: any,
    ) { }

    /**
     * Creates a new route object by patching the current route's query and/or path parameters.
     * The method does not perform navigation; it only prepares the target route object.
     * @param {Record<string, number|string|null>|false} query - An object of query parameters to merge
     * with the current ones. If `false`, all existing query parameters will be removed.
     * @param {Record<string, number|string|null>|false} [params={}] - An object of path parameters
     * to merge with the current ones. If `false`, all existing path parameters will be removed.
     * @param {string|null} [name=null] - The new route name. If `null`, the current route name is preserved.
     * @returns {any} A new route location object ready to be passed to `router.push()` or `router.replace()`.
     */
    public patchUrl(
        query: PatchFields|false,
        params: PatchFields|false = {},
        name: string|null = null
    ) {
        const r  = {
            ...this.route,
            name: name ?? this.route.name,
            query: this.getParams(this.route.query, query),
            params: this.getParams(this.route.params, params),
        };

        return r;
    }

    protected getParams(src: Record<string,string>, newValues: PatchFields|false): Record<string,UrlValue>
    {
        if (newValues === false) {
            return {};
        } else if (symbolKeepList in newValues) {
            const { [symbolKeepList]: fields, ...res } = newValues;
            for (const field of fields) {
                if (field in src) res[field] = src[field];
            }
            return res;
        } else {
            return {
                ...src,
                ...newValues,
            }
        }
    }

    protected getFields(src: Record<string,string>, fields: string[]): Record<string,string>
    {
        const res = {};
        for (const field of fields) {
            if (field in src)
                res[field] = src[field];
        }
        return res;
    }

    public patchRouteR(query: Record<string, number|string|null>, params: Record<string, number|string|null> = {}) {
        this.router.replace(this.patchUrl(query, params));
    }

    public patchRouteP(query: Record<string, number|string|null>, params: Record<string, number|string|null> = {}) {
        this.router.push(this.patchUrl(query, params));
    }

    public keep(...fields: string[]): PatchFields
    {
        return {
            [symbolKeepList]: fields
        };
    }
}
