# Router Utilities

The `useRouterUtil` composable provides a convenient way to manipulate route parameters and query strings without manually managing URL objects.

## Basic Usage

```typescript
import { useRouterUtil } from 'mu-vue-utils';
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    const router = useRouterUtil();

    return { router };
  }
};
```

Or with explicit router and route:

```typescript
import { useRouterUtil } from 'mu-vue-utils';
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    const customRouter = useRouterUtil(useRouter(), useRoute());

    return { customRouter };
  }
};
```

## API Reference

### `useRouterUtil(router?, route?)`

Returns a `RouterUtil` instance for manipulating routes.

**Parameters:**
- `router` (Router, optional) - Vue Router instance. Defaults to `useRouter()`
- `route` (any, optional) - Current route object. Defaults to `useRoute()`

**Returns:** `RouterUtil` instance

### `RouterUtil.patchUrl(query, params?, name?)`

Creates a new route location object without performing navigation.

**Parameters:**
- `query` (Record<string, string|number|null> | false) - Query parameters to merge with current ones. Pass `false` to clear all query parameters.
- `params` (Record<string, string|number|null> | false, optional) - Path parameters to merge. Defaults to `{}`. Pass `false` to clear all path parameters.
- `name` (string | null, optional) - Route name. Defaults to current route name.

**Returns:** Route location object

**Example:**
```typescript
const util = useRouterUtil();

// Create a route object (doesn't navigate)
const newRoute = util.patchUrl({ search: 'vue' }, {});
// Result: { name: 'current-route', query: { ...currentQuery, search: 'vue' }, params: { ...currentParams } }

// Clear all query parameters
const cleanRoute = util.patchUrl(false, {});
// Result: { name: 'current-route', query: {}, params: { ...currentParams } }
```

### `RouterUtil.patchRouteP(query, params?)`

Navigate to a patched route using `router.push()` (adds to history).

**Parameters:**
- `query` (Record<string, string|number|null>) - Query parameters to merge
- `params` (Record<string, string|number|null>, optional) - Path parameters to merge. Defaults to `{}`

**Example:**
```typescript
const util = useRouterUtil();

// Navigate with updated query parameters
util.patchRouteP({ page: 2, sort: 'name' });
// History: Current URL → New URL (user can go back)
```

### `RouterUtil.patchRouteR(query, params?)`

Replace the current route using `router.replace()` (doesn't add to history).

**Parameters:**
- `query` (Record<string, string|number|null>) - Query parameters to merge
- `params` (Record<string, string|number|null>, optional) - Path parameters to merge. Defaults to `{}`

**Example:**
```typescript
const util = useRouterUtil();

// Replace current URL in history
util.patchRouteR({ filter: 'active' });
// History: Not changed (user cannot go back to this state)
```

## Common Patterns

### Pagination

```vue
<script setup>
import { useRouterUtil } from 'mu-vue-utils';
import { ref } from 'vue';

const util = useRouterUtil();
const currentPage = ref(parseInt(useRoute().query.page) || 1);

const goToPage = (page) => {
  util.patchRouteP({ page });
};
</script>
```

### Filtering and Sorting

```vue
<script setup>
import { useRouterUtil } from 'mu-vue-utils';
import { ref } from 'vue';

const util = useRouterUtil();

const filters = ref({
  status: 'all',
  sort: 'name'
});

const applyFilters = () => {
  util.patchRouteR(filters.value);
};
</script>
```

### Route Parameter Updates

```vue
<script setup>
import { useRouterUtil } from 'mu-vue-utils';

const util = useRouterUtil();

const navigateToUser = (userId) => {
  util.patchRouteP({}, { id: userId });
};
</script>
```

## Notes

- Use `patchRouteP()` for user-initiated navigation to preserve browser history
- Use `patchRouteR()` for internal state changes that shouldn't be navigable in history
- Both methods merge with existing parameters—existing values are preserved unless explicitly overridden
- Query and path parameters preserve their existing values; only changed values need to be passed