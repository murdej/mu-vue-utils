# ID Generator

The `useIdGen` composable generates unique IDs scoped to each component instance. This is useful for creating unique identifiers for form elements, accessibility attributes, and other DOM-related purposes.

## Basic Usage

```vue
<script setup>
  import {useIdGen} from 'mu-vue-utils';
  import {reactive} from "vue";

  const idGen = useIdGen();
  const data = reactive({})
</script>

<template>
  <div>
    <label :for="idGen('email')">Email</label>
    <input :id="idGen('email')" v-model="data.email" type="email"/>
  </div>
  <div>
    <label :for="idGen('name')">Name</label>
    <input :id="idGen('name')" v-model="data.name" type="text"/>
  </div>
</template>
```

## API Reference

### `useIdGen()`

Returns a function that generates unique component-scoped IDs.

**Returns:** A function `(name: string) => string`

**Example:**
```typescript
import { useIdGen } from 'mu-vue-utils';

const idGen = useIdGen();
const id = idGen('input');  // Returns something like "42_input"
```

### ID Format

Generated IDs follow the format: `{componentUid}_{name}`

- `componentUid` - Unique identifier for the component instance (from Vue's internal `uid`)
- `name` - The name you provided

## Common Patterns

### Form Inputs with Labels

#### Basic usage:

```vue
<template>
  <div>
    <label :for="idGen('email')">Email</label>
    <input :id="idGen('email')" v-model="email" type="email" />
  </div>
</template>

<script setup>
import { useIdGen } from 'mu-vue-utils';

const idGen = useIdGen();

const email = ref('');
</script>
```

#### Dynamic ids:

```vue
<script setup>
  import { useIdGen } from 'mu-vue-utils';
  const idGen = useIdGen();
</script>

<template>
  <div v-for="item of items">
    <input type="checkbox" :id="idGen('item_' + item.id)" />
    <label :for="idGen('item_' + item.id)">{{ item.name }}</label>
  </div>
</template>
```

#### Use with attribut `ref`.

If the element has the `id` attribute, its value is used. If not, the id is generated.

**Warning:** If the ID is reactive, it will not function correctly.

```vue
<script setup>
  import { useIdGen } from 'mu-vue-utils';
  const idGen = useIdGen();
  const input1 = ref(null);
  const input2 = ref(null);
</script>

<template>
    <label :for="idGen(input1)">Email - ref, no id</label>
    <input ref="input1" v-model="data.email1" type="email"/>
    <hr />
    <label :for="idGen(input2)">Email - ref, static id</label>
    <input ref="input2" id="id-input2" v-model="data.email2" type="email"/>
</template>
```

### Accessibility (aria-labelledby)

```vue
<template>
  <div>
    <h2 :id="headingId">User Settings</h2>
    <section :aria-labelledby="headingId">
      <!-- Settings content -->
    </section>
  </div>
</template>

<script setup>
import { useIdGen } from 'mu-vue-utils';

const idGen = useIdGen();
const headingId = idGen('settings-heading');
</script>
```

## Why Use ID Generator

### Uniqueness
Each component instance gets its own scope, preventing ID collisions in reused components:

```vue
<!-- Using IDs without useIdGen (WRONG - duplicate IDs) -->
<template>
  <input id="search-input" />
</template>

<!-- Using useIdGen (CORRECT - unique per instance) -->
<template>
  <input :id="searchInputId" />
</template>
```

### Accessibility
Proper ID linking improves accessibility for screen readers:

```vue
<!-- Better accessibility -->
<label :for="inputId">Email</label>
<input :id="inputId" aria-describedby="helpId" />
<small :id="helpId">We'll never share your email</small>
```

### No Manual Tracking
No need to manually maintain unique ID counters or use random IDs.

## Notes

- Component UID comes from Vue's internal `getCurrentInstance().uid`
- Each time a component is mounted, it gets a new unique UID
- The same component instance will always generate the same IDs (deterministic)
- IDs are scoped to individual component instances, not globally unique
- Suitable for DOM id attributes, aria-labelledby, aria-describedby, etc.