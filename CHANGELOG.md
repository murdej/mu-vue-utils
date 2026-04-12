# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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
  - `FlashContainer.vue` — accepts a `visual?: VisualParamDef<FlashVisuals>` prop; resolves classes via `VisualParam` with `defaultFlashVisuals` as fallback
  - `FlashMessage.vue` — accepts a `visuals?` prop forwarded from `FlashContainer`; close button class is now configurable via `closeBtnClass` visual
  - `defaultFlashVisuals` exported from `flash.ts` — defines default Bootstrap-compatible classes (`alert`, `alert-*`, `flash-close-timer`, `btn-close`)
- **`Flash` class** (`flash.ts`) — removed `messageCssClasses` and `containerCssClasses` instance methods; CSS logic moved into components via `VisualParam`
- **`FlashVisuals`** type exported from `flash.ts` — `"containerClass" | "messageClass" | "messageTypePrefix" | "timerClass" | "closeBtnClass"`
- **`useUrlMirror()`** — `router` and `route` parameters are now optional; when omitted, they are resolved automatically via `useRouter()` / `useRoute()`
- **`UrlValue`** type in `routerUtils.ts` is now exported

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