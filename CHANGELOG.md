# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.5.0] - 2026-08-12

### Added
- **`ElementContent` type** (`src/Utils/types.ts`) - Shared content shape accepted by dialog/flash messages and buttons: plain string, `{ html }`, or `{ component, componentProps }`
- **`DynamicContent.vue`** - Renders an `ElementContent` value as text, raw HTML, or a dynamic component; used internally by `DialogBox.vue` and `FlashMessage.vue`
- **`useFlash()` composable** (`src/Composables/flash.ts`) - Replaces the old `flash` singleton
  - `addFlash(message, type, timeout, visuals)` pushes a new flash message and returns a `FlashApi`
  - `FlashApi` — per-message instance with `id`, `message`, `type`, `timeout`, `visuals`, and `remove()`
  - `FlashContainerData` — reactive `messages` list, optionally passed into `FlashContainer.vue` via `flashContainerData` prop
  - `defaultFlashVisuals` gains a `closeBtnText` slot (defaults to `×`)
- **`VisualParam` utility** (`src/Utils/VisualParam.ts`) - Cascading visual/CSS class configuration system
  - `VisualParam<T>` class resolves CSS classes from a priority-ordered list of `VisualParamDef` objects
  - `get(key)` returns the first defined value, `getAll()` merges all defs into one flat object
  - `StringsOrTag` type supports both class strings/arrays and HTML tag name keys (e.g. `*Tag` fields)
- **Dialog system** - Programmatic modal dialogs using the native `<dialog>` element
  - `useDialog()` composable — `addDialog(message, buttons, visuals)` opens a dialog and returns a `DialogApi`
  - `DialogApi.wait()` — returns a Promise that resolves to the clicked button's value
  - `DialogApi.onCancel()` — resolves the promise with `null` on native dialog cancel (Esc key)
  - **`DialogBox.vue`** — renders a single dialog with message, buttons, and scoped flex layout
  - **`DialogContainer.vue`** — renders all active dialogs; accepts `dialogContainerData` and optional `visual` prop
  - `DialogVisuals` type — customizable slots: `containerClass`, `buttonClass`, `messageClass`, `buttonContainerClass`, `dialogClass`

### Changed
- **Flash components** — migrated to TypeScript (`<script setup lang="ts">`) and switched to `VisualParam`-based styling
  - `FlashContainer.vue` — accepts a `visual?: VisualParamDef<FlashVisuals>` prop and an optional `flashContainerData` prop; falls back to `useFlash()`'s shared instance when omitted
  - `FlashMessage.vue` — now takes a single `data: FlashApi` prop instead of separate `message`/`type`/`id`/`timeout` props; renders its message via `DynamicContent`; close button class is now configurable via `closeBtnClass` visual and its label via `closeBtnText`
  - `defaultFlashVisuals` exported from `Composables/flash.ts` (moved from `Utils/flash.ts`) — defines default Bootstrap-compatible classes (`alert`, `alert-*`, `flash-close-timer`, `btn-close`)
- **`Flash` class and `Utils/flash.ts` removed** — replaced by the `useFlash()` composable and `FlashApi` class in `Composables/flash.ts`
- **`FlashVisuals`** type exported from `Composables/flash.ts` — `"containerClass" | "itemClass" | "messageClass" | "messageTypePrefix" | "timerClass" | "closeBtnClass" | "closeBtnText"`
- **`DialogApi.message` and `ButtonDef.label`** now accept `ElementContent` instead of a plain string; `ButtonDef.labelHtml` removed in favor of passing `{ html }` as the `label`
- **`useUrlMirror()`** — `router` and `route` parameters are now optional; when omitted, they are resolved automatically via `useRouter()` / `useRoute()`
- **`UrlValue`** type in `routerUtils.ts` is now exported
- **Build config** — `tsconfig.json` switched from `NodeNext`/`NodeNext` to `ESNext`/`Bundler` module resolution; `build`/`watch` scripts no longer pass `--module nodenext`

### Fixed
- **`useIdGen`** — corrected async `nextTick()` call (added missing `await`); updated return type to include `Promise<string>`

## [1.4.0] - 2026-03-26

### Added
- **`RouterUtil.keep(...fields)`** - Build a query/params patch that preserves only the specified fields from the current route, discarding all others
- **Jest test suite** - Unit testing infrastructure with TypeScript and ESM support
  - `jest`, `ts-jest`, `@vue/test-utils` configured for Vue 3 + TypeScript + ESM
  - `jest.config.ts` with pnpm virtual store compatibility
  - `tsconfig.test.json` for test-specific TypeScript settings
  - Tests for `RouterUtil`: `patchUrl()`, `keep()`, `patchRouteP()`, `patchRouteR()`
  - Tests for `useIdGen`: compound ID generation, uniqueness

## [1.3.0] - 2026-01-30

- **ID Generator Composable** (`useIdGen`) - Generate unique component-based IDs
  - It is possible to pass `ref` to an HTML element.
  - Configurable prefix options for compound and generated IDs
- **URL Mirror Composable** (`useUrlMirror`) - Keep reactive variables synchronized with URL query parameters
  - Support for route parameters using `@` prefix (e.g., `@:userId`)

## [1.2.0] - 2025-12-02

### Added
- **Router Utilities** (`useRouterUtil`, `RouterUtil`) - Simplified route parameter and query manipulation
  - `patchUrl()` - Create route objects with modified query and path parameters
  - `patchRouteP()` - Navigate to a patched route (push)
  - `patchRouteR()` - Replace current route with patched version
- **URL Mirror Composable** (`useUrlMirror`) - Keep reactive variables synchronized with URL query parameters
  - `add()` - Link one or more refs to query parameters with custom serialization
  - `create()` - Create a single ref linked to a query parameter
  - `createObject()` - Create a reactive object with properties synchronized to query parameters
    - Support for per-property patch method callbacks
  - Support for multiple serialization formats: String, Number, Integer, Float, Boolean, JSON
- **ID Generator Composable** (`useIdGen`) - Generate unique component-based IDs
  - Automatic UUID fallback when Vue instance unavailable
  - Auto-ID assignment for element refs
- **Flash Messaging System** (`flash`, `Flash`)
  - `Flash` class with message buffering and callback registration
  - Customizable CSS classes for messages and containers
  - Type aliases for mapping message types to Bootstrap classes
  - **Components**: `FlashContainer.vue`, `FlashMessage.vue`

### Fixed
- Initial project setup with TypeScript configuration

## [1.0.0] - 2025-11-18

### Added
- Initial project structure
- TypeScript configuration
- Vue 3 and Vue Router support
- Basic package.json with dependencies