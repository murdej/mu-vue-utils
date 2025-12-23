# URL Mirror

The `useUrlMirror` composable automatically synchronizes reactive variables with URL query parameters. Changes to variables update the URL, and URL changes update the variables—all two-way synchronized.

## Basic Usage

```typescript
import { useUrlMirror } from 'mu-vue-utils';
import { ref } from 'vue';

const mirror = useUrlMirror();
const searchQuery = mirror.create('search', 'String');

// Changing the ref updates the URL
searchQuery.value = 'vue';
// URL changes to: ?search=vue

// URL change updates the ref (e.g., user navigates or shares a URL)
// If URL is now ?search=react, searchQuery.value becomes 'react'
```

## Core Concepts

**URL Mirror** keeps your reactive state in sync with URL query parameters automatically:
- Change a ref → URL updates
- URL changes → ref updates
- Initial synchronization happens on setup

## API Reference

### `useUrlMirror(router?, route?)`

Creates a new UrlMirror instance.

**Parameters:**
- `router` (Router | null, optional) - Vue Router instance. Defaults to `useRouter()`
- `route` (any | null, optional) - Current route object. Defaults to `useRoute()`

**Returns:** `UrlMirror` instance

### `UrlMirror.create(queryParam, serialize?, patchMethod?)`

Creates and links a single reactive ref to a URL query parameter.

**Parameters:**
- `queryParam` (string) - The query parameter name
- `serialize` (InputSerializerDef, optional) - Serialization format. Defaults to `'String'`
- `patchMethod` ('replace' | 'push', optional) - How to update the URL. Defaults to `'replace'`

**Returns:** A reactive ref

**Example:**
```typescript
const mirror = useUrlMirror();

// String parameter
const search = mirror.create('q', 'String');

// Number parameter
const page = mirror.create('page', 'Number');

// Boolean parameter
const showArchived = mirror.create('archived', 'Boolean');
```

### `UrlMirror.add(queryParam, variable?, serialize?, patchMethod?)`

Links one or more existing refs to query parameters.

**Parameters:**
- `queryParam` (string | Record<string, Ref>) - Query parameter name or map of param names to refs
- `variable` (Ref | null, optional) - Ref to link (required if queryParam is a string)
- `serialize` (InputSerializerDef | null, optional) - Serialization format. Defaults to `'String'`
- `patchMethod` ('replace' | 'push', optional) - How to update the URL. Defaults to `'replace'`

**Returns:** The linked ref if a single string param, otherwise null

**Example:**
```typescript
const mirror = useUrlMirror();
const existing = ref('default');

// Link a single ref
mirror.add('filter', existing, 'String');

// Link multiple refs at once
const myRefs = {
  search: ref(''),
  sort: ref('name'),
  page: ref(1)
};
mirror.add(myRefs, null, 'String'); // serialize and patchMethod apply to all
```

### `UrlMirror.createObject(definitions, patchMethod?)`

Creates a reactive object with multiple properties synchronized to query parameters.

**Parameters:**
- `definitions` (Record<string, InputSerializerDef>) - Property definitions
- `patchMethod` ('replace' | 'push' | function, optional) - URL update strategy. Defaults to `'replace'`

**Returns:** A reactive object with synchronized properties

**Example:**
```typescript
const mirror = useUrlMirror();

const filters = mirror.createObject({
  search: 'String',
  page: 'Number',
  sort: 'String',
  archived: 'Boolean'
});

// Access synchronized properties
filters.search = 'vue';  // Updates URL to ?search=vue&page=...&sort=...&archived=...
filters.page = 2;        // Updates URL to ?search=vue&page=2&sort=...&archived=...
```

## Serialization Formats

URL query parameters are always strings, so values must be serialized/deserialized.

### Built-in Formats

- **'String'** (default) - Basic string serialization
- **'Number'** or **'Float'** - Floating-point numbers (e.g., `3.14`)
- **'Integer'** - Whole numbers (e.g., `42`)
- **'Boolean'** - `'1'` for true, `'0'` for false
- **'JSON'** - Complex objects and arrays as JSON

### Type Constructors

You can also use JavaScript type constructors:

```typescript
const mirror = useUrlMirror();

const num = mirror.create('count', Number);      // Same as 'Number'
const bool = mirror.create('show', Boolean);     // Same as 'Boolean'
const str = mirror.create('name', String);       // Same as 'String'
const obj = mirror.create('data', Object);       // Same as 'JSON'
```

### Custom Serialization

For custom types, provide an object with `serializer` and `deserializer`:

```typescript
const mirror = useUrlMirror();

const customDef = {
  serializer: (value) => {
    if (value === null) return null;
    return JSON.stringify(value.toISOString()); // Custom serialization
  },
  deserializer: (str) => {
    if (!str) return null;
    return new Date(JSON.parse(str)); // Custom deserialization
  }
};

const date = mirror.create('date', customDef);
```

## URL Update Methods

### `patchMethod: 'replace'` (default)

Updates the URL without adding to browser history. Use for temporary state:

```typescript
const filters = mirror.createObject(
  { search: 'String', page: 'Number' },
  'replace'  // Don't pollute browser history with filter changes
);
```

### `patchMethod: 'push'`

Adds new history entries for each change. Use for significant navigation:

```typescript
const data = mirror.createObject(
  { userId: 'Number' },
  'push'  // User can navigate back through different users
);
```

### `patchMethod: function`

Use a function to decide per-property:

```typescript
const form = mirror.createObject(
  { search: 'String', userId: 'Number', draft: 'String' },
  (propName, value) => {
    if (propName === 'userId') return 'push';  // Important navigation
    return 'replace';                           // Temporary state
  }
);
```

## Common Patterns

### Search Form

```vue
<template>
  <input v-model="filters.search" placeholder="Search..." />
  <select v-model="filters.category">
    <option value="">All Categories</option>
    <option value="vue">Vue</option>
    <option value="react">React</option>
  </select>
  <button @click="resetFilters">Reset</button>
</template>

<script setup>
import { useUrlMirror } from 'mu-vue-utils';

const mirror = useUrlMirror();
const filters = mirror.createObject({
  search: 'String',
  category: 'String'
});

const resetFilters = () => {
  filters.search = '';
  filters.category = '';
};
</script>
```

### Pagination with Filters

```vue
<template>
  <div>
    <input v-model="state.q" placeholder="Search" />
    <select v-model.number="state.page">
      <option v-for="n in 10" :key="n" :value="n">Page {{ n }}</option>
    </select>
    <div v-for="item in items" :key="item.id">{{ item.name }}</div>
  </div>
</template>

<script setup>
import { useUrlMirror } from 'mu-vue-utils';
import { computed } from 'vue';

const mirror = useUrlMirror();
const state = mirror.createObject({
  q: 'String',
  page: 'Number'
});

const items = computed(() => {
  // Fetch and filter based on state.q and state.page
  return fetchItems(state.q, state.page);
});
</script>
```

### Complex State with JSON

```vue
<script setup>
import { useUrlMirror } from 'mu-vue-utils';

const mirror = useUrlMirror();
const state = mirror.createObject({
  filters: 'JSON',      // Can store { category: 'vue', level: 'advanced' }
  selectedIds: 'JSON'   // Can store [1, 2, 3]
});

// Update complex state
state.filters = { category: 'vue', level: 'advanced' };
state.selectedIds = [1, 2, 3];
// URL: ?filters={"category":"vue","level":"advanced"}&selectedIds=[1,2,3]
</script>
```

## Notes

- URL Mirror automatically prevents infinite update loops
- Initial synchronization prioritizes URL values over local defaults
- Both `add()` and `create()` methods return the same Ref object
- For object properties, use deep watching (enabled by default)
- Null/undefined values are handled gracefully and typically omitted from URLs