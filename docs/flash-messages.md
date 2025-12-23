# Flash Messages

Flash messages are temporary notifications that appear to the user, typically used for success confirmations, error alerts, or informational messages. The flash system provides a simple message queue with Vue components for rendering.

## Basic Setup

### 1. Register the Container Component

Place the `FlashContainer` component at the root of your app (usually in `App.vue`):

```vue
<template>
  <div id="app">
    <FlashContainer />
    <!-- Your application content -->
  </div>
</template>

<script setup>
import { FlashContainer } from 'mu-vue-utils';
</script>
```

### 2. Display Messages

Use the `flash` object to add messages:

```typescript
import { flash } from 'mu-vue-utils';

// Add an info message
flash.add('info', 'Operation completed successfully!');

// Add an error message
flash.add('error', 'Something went wrong. Please try again.');

// Add custom type message
flash.add('warning', 'This action cannot be undone.');
```

## API Reference

### `flash.add(type, message)`

Adds a message to the flash queue.

**Parameters:**
- `type` (string) - The message type ('info', 'error', or custom)
- `message` (string) - The message text

**Example:**
```typescript
import { flash } from 'mu-vue-utils';

flash.add('info', 'Data saved successfully');
flash.add('error', 'Failed to load data');
flash.add('custom-warning', 'Custom message type');
```

### `flash.typeAlias`

A mapping of message types to CSS class names (for Bootstrap integration).

**Default:**
```typescript
{
  'info': 'primary',
  'error': 'danger'
}
```

**Customize:**
```typescript
import { flash } from 'mu-vue-utils';

flash.typeAlias['success'] = 'success';
flash.typeAlias['warning'] = 'warning';
```

### `flash.messageCssClasses`

Function that returns CSS classes for a message element.

**Default behavior:** Returns Bootstrap alert classes
- `'alert'`
- `'alert-{typeAlias}'`
- `'flash-close-timer'` (if message is timing out)

**Customize:**
```typescript
import { flash } from 'mu-vue-utils';

flash.messageCssClasses = (type, isTimeout) => ({
  'toast': true,
  'toast-success': type === 'info',
  'toast-error': type === 'error',
  'fading': isTimeout
});
```

### `flash.containerCssClasses`

Function that returns CSS classes for the container element.

**Default:** `['flash-container']`

**Customize:**
```typescript
import { flash } from 'mu-vue-utils';

flash.containerCssClasses = () => [
  'notification-center',
  'position-fixed',
  'top-0',
  'right-0'
];
```

## Components

### `<FlashContainer />`

Renders the flash message container. Place this at the root of your application.

**Props:** None

**Events:** None

**Example:**
```vue
<template>
  <div class="app">
    <FlashContainer />
    <!-- Rest of app -->
  </div>
</template>

<script setup>
import { FlashContainer } from 'mu-vue-utils';
</script>
```

### `<FlashMessage />`

Renders an individual flash message (used internally by `FlashContainer`).

**Props:**
- `type` (string) - Message type
- `message` (string) - Message text
- `timeout` (number) - Auto-dismiss timeout in milliseconds

**Events:**
- `@close` - Emitted when the message should be dismissed

## Common Patterns

### Success Message After Action

```vue
<template>
  <button @click="saveData">Save</button>
</template>

<script setup>
import { flash } from 'mu-vue-utils';

const saveData = async () => {
  try {
    await api.save();
    flash.add('info', 'Data saved successfully!');
  } catch (error) {
    flash.add('error', `Failed to save: ${error.message}`);
  }
};
</script>
```

### Changing han

Todo

## Styling with Bootstrap

The default setup uses Bootstrap classes. Messages appear with `alert-{type}` styling:

```css
/* Customize message appearance */
.alert {
  padding: 12px 20px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.flash-close-timer {
  opacity: 0.5;
}
```

## Message Types

### Built-in Types

- **'info'** (alias: 'primary') - General information, typically blue
- **'error'** (alias: 'danger') - Error messages, typically red

### Custom Types

Define and use custom message types:

```typescript
import { flash } from 'mu-vue-utils';

// Add type alias
flash.typeAlias['success'] = 'success';
flash.typeAlias['warning'] = 'warning';
flash.typeAlias['debug'] = 'secondary';

// Use custom types
flash.add('success', 'Operation completed!');
flash.add('warning', 'This may take a while');
flash.add('debug', 'Debug information');
```

## Before Component Registration

If you call `flash.add()` before `FlashContainer` has registered its callback, messages are buffered and displayed when the component mounts.

```typescript
// Called before app initialization
flash.add('info', 'Loading...');

// Later, when FlashContainer mounts:
// This message is automatically displayed
```

## Notes

- Messages are stored in a FIFO (first-in, first-out) queue
- The default dismissal behavior can be customized by modifying `FlashMessage` component
- `flash` is a singleton instance—all parts of your app share the same message queue
- For handling multiple simultaneous messages, use the container's layout CSS