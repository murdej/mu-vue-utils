import {Router, useRoute, useRouter} from "vue-router";
export function useRouterUtil(router: Router = null, route = null) {
    return new RouterUtil(
        router ?? useRouter(),
        route ?? useRoute(),
    );
}

export class RouterUtil {
    constructor(
        public router: Router,
        public route: any,
    ) { }
    public patchUrl(query: Record<string, number|string|null>, params: Record<string, number|string|null> = {}, name: string|null = null) {
        const r  = {
            ...this.route,
            name: name ?? this.route.name,
            query: {
                ...this.route.query,
                ...query,
            },
            params: {
                ...this.route.params,
                ...params,
            },
        };

        return r;
    }

    public patchRouteR(query: Record<string, number|string|null>, params: Record<string, number|string|null> = {}) {
        this.router.replace(this.patchUrl(query, params));
    }

    public patchRouteP(query: Record<string, number|string|null>, params: Record<string, number|string|null> = {}) {
        this.router.push(this.patchUrl(query, params));
    }
}
