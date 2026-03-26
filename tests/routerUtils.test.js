import { jest } from '@jest/globals';
import { RouterUtil } from '../src/Composables/routerUtils.js';
function makeRoute(query = {}, params = {}, name = 'testRoute') {
    return { name, query, params };
}
function makeRouter() {
    return {
        push: jest.fn(),
        replace: jest.fn(),
    };
}
describe('RouterUtil', () => {
    describe('patchUrl', () => {
        it('merges query params with existing ones', () => {
            const route = makeRoute({ page: '1', sort: 'asc' });
            const util = new RouterUtil(makeRouter(), route);
            const result = util.patchUrl({ page: '2' });
            expect(result.query).toEqual({ page: '2', sort: 'asc' });
        });
        it('removes all query params when query is false', () => {
            const route = makeRoute({ page: '1', sort: 'asc' });
            const util = new RouterUtil(makeRouter(), route);
            const result = util.patchUrl(false);
            expect(result.query).toEqual({});
        });
        it('merges path params with existing ones', () => {
            const route = makeRoute({}, { id: '1', lang: 'cs' });
            const util = new RouterUtil(makeRouter(), route);
            const result = util.patchUrl({}, { id: '2' });
            expect(result.params).toEqual({ id: '2', lang: 'cs' });
        });
        it('removes all path params when params is false', () => {
            const route = makeRoute({}, { id: '1', lang: 'cs' });
            const util = new RouterUtil(makeRouter(), route);
            const result = util.patchUrl({}, false);
            expect(result.params).toEqual({});
        });
        it('preserves current route name when name is null', () => {
            const route = makeRoute({}, {}, 'myRoute');
            const util = new RouterUtil(makeRouter(), route);
            const result = util.patchUrl({});
            expect(result.name).toBe('myRoute');
        });
        it('overrides route name when name is provided', () => {
            const route = makeRoute({}, {}, 'myRoute');
            const util = new RouterUtil(makeRouter(), route);
            const result = util.patchUrl({}, {}, 'otherRoute');
            expect(result.name).toBe('otherRoute');
        });
        it('sets null query param (removes value)', () => {
            const route = makeRoute({ page: '1', sort: 'asc' });
            const util = new RouterUtil(makeRouter(), route);
            const result = util.patchUrl({ sort: null });
            expect(result.query).toEqual({ page: '1', sort: null });
        });
    });
    describe('keep()', () => {
        it('keeps only specified fields from existing query', () => {
            const route = makeRoute({ page: '1', sort: 'asc', filter: 'active' });
            const util = new RouterUtil(makeRouter(), route);
            const result = util.patchUrl(util.keep('page', 'filter'));
            expect(result.query).toEqual({ page: '1', filter: 'active' });
        });
        it('ignores fields not present in existing query', () => {
            const route = makeRoute({ page: '1' });
            const util = new RouterUtil(makeRouter(), route);
            const result = util.patchUrl(util.keep('page', 'nonexistent'));
            expect(result.query).toEqual({ page: '1' });
        });
        it('returns empty object when no kept fields exist', () => {
            const route = makeRoute({ page: '1' });
            const util = new RouterUtil(makeRouter(), route);
            const result = util.patchUrl(util.keep('nonexistent'));
            expect(result.query).toEqual({});
        });
    });
    describe('patchRouteP', () => {
        it('calls router.push with patched route', () => {
            const router = makeRouter();
            const route = makeRoute({ page: '1' });
            const util = new RouterUtil(router, route);
            util.patchRouteP({ page: '2' });
            expect(router.push).toHaveBeenCalledWith(expect.objectContaining({ query: { page: '2' } }));
        });
    });
    describe('patchRouteR', () => {
        it('calls router.replace with patched route', () => {
            const router = makeRouter();
            const route = makeRoute({ page: '1' });
            const util = new RouterUtil(router, route);
            util.patchRouteR({ page: '3' });
            expect(router.replace).toHaveBeenCalledWith(expect.objectContaining({ query: { page: '3' } }));
        });
    });
});
