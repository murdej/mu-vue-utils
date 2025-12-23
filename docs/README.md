# mu-vue-utils Documentation

A collection of Vue 3 composables and utilities for working with Vue Router, URL state management, and flash messages.

## Quick Start

```bash
npm install mu-vue-utils
# or
pnpm add mu-vue-utils
```

## Core Features

- **Router Utilities** - Simplify route parameter manipulation with `useRouterUtil`
- **URL Mirror** - Keep reactive state synchronized with URL query parameters
- **ID Generator** - Generate unique component IDs with `useIdGen`
- **Flash Messages** - Display flash messages with built-in Vue components

## Guides

- [Getting Started](./getting-started.md) - Basic setup and examples
- [Router Utilities](./router-utils.md) - Managing route parameters and navigation
- [URL Mirror](./url-mirror.md) - Synchronizing reactive state with URLs
- [Flash Messages](./flash-messages.md) - Displaying temporary notifications
- [ID Generator](./id-generator.md) - Generating unique component IDs

## Table of Contents

- **Router Utilities** (`useRouterUtil`)
  - Patch query parameters
  - Patch path parameters
  - Navigate using patches

- **URL Mirror** (`useUrlMirror`)
  - Single ref synchronization
  - Object synchronization
  - Custom serialization

- **Flash System** (`flash`)
  - Message types (info, error, custom)
  - Message display
  - CSS customization

- **ID Generator** (`useIdGen`)
  - Component-based ID generation