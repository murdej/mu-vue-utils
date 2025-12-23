# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
  - Support for multiple serialization formats: String, Number, Integer, Float, Boolean, JSON
- **ID Generator Composable** (`useIdGen`) - Generate unique component-based IDs
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