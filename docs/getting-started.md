# Getting Started with mu-vue-utils

A collection of utilities for Vue 3 applications that simplify working with Vue Router, managing URL state, and displaying flash messages.

## Installation

```bash
npm install mu-vue-utils
# or
pnpm add mu-vue-utils
# or
yarn add mu-vue-utils
```

## Prerequisites

- Vue 3.5+
- Vue Router 4.6+
- TypeScript support (optional but recommended)

## Quick Start

### 1. Setup Flash Messages (Optional)

If you're using flash messages, add the container to your root component:

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <FlashContainer />
    <header>
      <h1>My App</h1>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { FlashContainer } from 'mu-vue-utils';
</script>
```

### 2. Basic Example

Here's a simple search page using Router Utilities and URL Mirror:

```vue
<template>
  <div>
    <h1>Search Products</h1>

    <!-- Search form -->
    <div>
      <input
        v-model="filters.search"
        type="text"
        placeholder="Search..."
      />
      <select v-model="filters.category">
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="books">Books</option>
      </select>
      <button @click="resetSearch">Reset</button>
    </div>

    <!-- Results -->
    <div class="results">
      <div v-for="product in results" :key="product.id">
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button
        v-for="n in totalPages"
        :key="n"
        :disabled="pagination.page === n"
        @click="pagination.page = n"
      >
        {{ n }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useUrlMirror } from 'mu-vue-utils';
import { computed, ref } from 'vue';

// Create URL mirror for search filters
const mirror = useUrlMirror();
const filters = mirror.createObject({
  search: 'String',
  category: 'String'
});

// Create URL mirror for pagination
const pagination = mirror.createObject({
  page: 'Number'
});

// Mock products
const allProducts = [
  { id: 1, name: 'Laptop', description: 'High-performance laptop', category: 'electronics' },
  { id: 2, name: 'Vue.js Guide', description: 'Learn Vue 3', category: 'books' },
  // ... more products
];

// Filter and paginate results
const results = computed(() => {
  let filtered = allProducts;

  if (filters.search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(filters.search.toLowerCase())
    );
  }

  if (filters.category) {
    filtered = filtered.filter(p => p.category === filters.category);
  }

  const itemsPerPage = 10;
  const start = ((pagination.page || 1) - 1) * itemsPerPage;
  return filtered.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  const filtered = allProducts.filter(p => {
    let matches = true;
    if (filters.search) {
      matches = p.name.toLowerCase().includes(filters.search.toLowerCase());
    }
    if (filters.category) {
      matches = matches && p.category === filters.category;
    }
    return matches;
  });
  return Math.ceil(filtered.length / 10);
});

const resetSearch = () => {
  filters.search = '';
  filters.category = '';
  pagination.page = 1;
};
</script>

<style scoped>
input, select {
  padding: 8px;
  margin-right: 10px;
}

.results {
  margin: 20px 0;
  display: grid;
  gap: 15px;
}

.pagination {
  display: flex;
  gap: 5px;
  justify-content: center;
  margin-top: 20px;
}
</style>
```

### URL Behavior

When using the example above, as you interact with the page:

- Typing in the search box updates the URL to: `?search=laptop&category=electronics&page=1`
- Changing the category updates the URL: `?search=&category=books&page=1`
- Clicking page 2 updates the URL: `?search=laptop&category=electronics&page=2`
- Sharing the URL will restore all filters and pagination state automatically

## Next Steps

### Learn More About Each Feature

- **[Router Utilities](./router-utils.md)** - Manipulate route parameters and navigate
- **[URL Mirror](./url-mirror.md)** - Synchronize reactive state with URL query parameters
- **[Flash Messages](./flash-messages.md)** - Display temporary notifications
- **[ID Generator](./id-generator.md)** - Generate unique component-scoped IDs

## Common Use Cases

### User Preferences in URL

Keep user preferences in the URL for shareable links:

```typescript
import { useUrlMirror } from 'mu-vue-utils';

const preferences = useUrlMirror().createObject({
  theme: 'String',       // 'light' | 'dark'
  sidebarCollapsed: 'Boolean',
  language: 'String'     // 'en' | 'es' | 'fr'
});

// URL: ?theme=dark&sidebarCollapsed=true&language=es
```

### Form with Router Navigation

```typescript
import { useRouterUtil } from 'mu-vue-utils';

const router = useRouterUtil();
const navigateToResults = (query) => {
  router.patchRouteP({ q: query, page: 1 });
};
```

### Message After Action

```typescript
import { flash } from 'mu-vue-utils';

const saveSettings = async () => {
  try {
    await api.saveSettings();
    flash.add('info', 'Settings saved successfully!');
  } catch (error) {
    flash.add('error', 'Failed to save settings');
  }
};
```

### Accessible Form Fields

```typescript
import { useIdGen } from 'mu-vue-utils';

const idGen = useIdGen();

// Generates unique IDs: "42_username", "42_password", etc.
const usernameId = idGen('username');
const passwordId = idGen('password');
```

## Troubleshooting

### Flash messages not appearing?

Make sure you've added `<FlashContainer />` to your root component:

```vue
<template>
  <div id="app">
    <FlashContainer /> <!-- Required for flash messages -->
    <RouterView />
  </div>
</template>

<script setup>
import { FlashContainer } from 'mu-vue-utils';
</script>
```

### URL not updating?

Make sure you're using the composables inside `<script setup>` or setup function:

```typescript
// ✓ Correct - inside setup
const mirror = useUrlMirror();

// ✗ Wrong - outside setup/components
export const mirror = useUrlMirror(); // This won't work
```

### IDs not unique?

Make sure you're calling `useIdGen()` inside a component's setup:

```vue
<script setup>
// ✓ Correct
const idGen = useIdGen();

// This component gets its own unique IDs
const inputId = idGen('input');
</script>
```

## Examples and Patterns

### Search with Filters

```typescript
const filters = useUrlMirror().createObject({
  q: 'String',
  category: 'String',
  minPrice: 'Number',
  maxPrice: 'Number'
});
```

### Data Table with Sorting

```typescript
const tableState = useUrlMirror().createObject({
  sort: 'String',        // 'name' | 'date' | 'size'
  order: 'String',       // 'asc' | 'desc'
  page: 'Number'
});
```

### Multi-step Form

```typescript
const form = useUrlMirror().createObject({
  step: 'Number',
  email: 'String',
  name: 'String',
  country: 'String'
});
```

## Tips and Best Practices

1. **Use `replace` for filters** - Filter changes shouldn't pollute browser history
   ```typescript
   const filters = useUrlMirror().createObject({...}, 'replace');
   ```

2. **Use `push` for navigation** - Page changes should be in history
   ```typescript
   const pagination = useUrlMirror().createObject({...}, 'push');
   ```

3. **Combine with router guards** - Validate URL parameters before using them
   ```typescript
   router.beforeEach((to, from, next) => {
     // Validate query parameters
     next();
   });
   ```

4. **Use JSON for complex data** - When storing objects in the URL
   ```typescript
   const advanced = useUrlMirror().create('filters', 'JSON');
   ```

5. **Always provide initial values** - Set sensible defaults
   ```typescript
   const filters = useUrlMirror().createObject({
     page: 'Number'  // Will default to null, update to 1 when setting
   });
   ```

## Next Steps

- Read the [CHANGELOG](../CHANGELOG.md) to see what's been added
- Check out individual feature documentation for more advanced usage
- View the source code on GitHub (if available)

Happy coding!