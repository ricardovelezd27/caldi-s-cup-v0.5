# Changelog

All notable changes to Caldi's Cup are documented here.

## [0.4.0] - 2025-12-16 - Error Handling & Production Resilience

### Added
- **Error Boundaries** (Phase 4A):
  - `ErrorBoundary` component - global React error catcher
  - `ErrorFallback` component - user-friendly error UI with recovery options
  - App wrapped with ErrorBoundary to prevent white-screen crashes

- **Error Logging Service** (Phase 4B):
  - `errorLogger` service with structured logging
  - Log levels: debug, info, warn, error, fatal
  - In-memory buffer (50 entries) for debugging
  - User context support for error correlation
  - Ready for external service integration (Sentry, LogRocket)

- **Network Resilience** (Phase 4C):
  - `retryWithBackoff` utility - exponential backoff with jitter
  - `useNetworkStatus` hook - monitor connectivity
  - `OfflineIndicator` component - banner when offline
  - Configurable retry options (max retries, delays, abort signal)

- **Storage Fallbacks** (Phase 4D):
  - `storageFactory` with automatic fallbacks: localStorage → sessionStorage → memory
  - User notification when storage is degraded
  - Safe JSON parse/stringify utilities
  - CartContext integrated with storage fallbacks

- **Rate Limiting** (Phase 4E):
  - Token bucket rate limiter (`createRateLimiter`)
  - Cart-specific rate limiter singleton
  - Integrated with `useOptimisticCart` hook
  - 10 ops burst, 2/sec refill rate

- **Documentation** (Phase 4F):
  - `docs/ERROR_HANDLING.md` - comprehensive error handling guide
  - Updated README.md with Phase 4 status
  - Updated BACKLOG.md with completed items

### Changed
- ErrorBoundary now uses `errorLogger.captureFatal()` for crash logging
- CartContext uses `getStorage()` for storage abstraction
- `useOptimisticCart` now includes rate limiting protection
- App.tsx includes `OfflineIndicator` component

---

## [0.3.0] - 2025-12-16 - Backend-Agnostic Integration Prep

### Added
- **Backend-Agnostic Architecture**:
  - `ExtendedCartState` type replacing Shopify-specific naming
  - `CartItemOperations` for per-item loading/error states
  - `lineId` field in `CartItem` for external backend sync
- **Optimistic Updates**:
  - `useOptimisticCart` hook with debounced updates (300ms)
  - Automatic rollback on failure
  - Per-item loading states
- **Service Factory Pattern**:
  - `createCartService()` supports local/shopify/supabase backends
  - `getDefaultDataSource()` and `isBackendAvailable()` helpers
- **Backend Options Documentation**:
  - `docs/BACKEND_OPTIONS.md` with Shopify vs Supabase comparison
  - Database schema for Supabase alternative
  - Stripe integration examples
  - Migration path documentation

### Changed
- Renamed `ShopifyCartState` to `ExtendedCartState` (deprecated alias kept)
- Renamed `shopifyCartId` to `externalCartId`
- Renamed `isShopifyConnected` to `isBackendConnected`
- Cart context now exposes `dispatch` for advanced use cases
- Updated all components to use backend-agnostic terminology

---

## [0.2.0] - 2025-12-15 - Marketplace Browse & Navigation

### Added
- **Marketplace Browse Page** (`/marketplace`) with full feature set:
  - Product grid with responsive layout (1/2/3 columns)
  - Filter panel (search, origin, roast level, grind, price range)
  - Sort dropdown (best match, price, newest, rating)
  - Pagination controls with page navigation
  - Skeleton loaders during loading states
- **Navigation System**:
  - Desktop navigation links in header (Marketplace)
  - Mobile hamburger menu with Sheet slide-out drawer
  - Centralized `NAV_LINKS` array in app constants
- **New Components**:
  - `ProductCard` (with React.memo optimization)
  - `ProductCardSkeleton`, `SortDropdown`, `FilterPanel`
  - `ProductGrid`, `MarketplacePagination`
- **New Utilities**:
  - `useDebouncedValue` hook for search debouncing
  - Filter/sort/paginate utilities in `productFilters.ts`
  - API contract types (`ProductsQueryParams`, `ProductsResponse`)
- 9 additional mock products (total 12) for testing pagination

### Changed
- Desktop container uses `size="wide"` for marketplace
- Product Page accordions have consistent `px-4` padding

---

## [0.1.0] - 2025-12-12 - Foundation & Code Cleanup

### Added
- Landing page with Hero, Problem, and Solution sections
- Brand design system with 60/30/10 color hierarchy (Foam White/Clarity Teal/Energy Yellow)
- Reusable components: `CaldiCard`, `SectionHeading`, `Container`
- Layout components: `PageLayout`, `Header`, `Footer`
- TypeScript types for coffee domain entities (`FlavorProfile`, `CoffeeBean`, `UserTasteProfile`)
- Hero section with Modern Caldi mascot and Path to Clarity background
- Two-line hero headline with dual color styling (primary + accent)
- Centralized app configuration in `APP_CONFIG`

### Changed
- Centralized CTA text in `APP_CONFIG.cta.primary` and `APP_CONFIG.cta.secondary`
- Moved hero background inline styles to `.hero-background` CSS class
- Updated favicon to custom brand icon (`public/favicon.png`)

### Removed
- Unused character assets: `caldi-farmer.png`, `caldi-modern.png`
- Unused illustration assets: `coffee-bag-group.svg`, `coffee-bag-single.svg`
- Unused logo files: `logo.svg`, `favicon.svg`, `favicon.ico`
- Dead code: unused imports, empty rotation properties

### Fixed
- Removed unused `logo.svg` import from `Header.tsx`
- JSX element closing tag errors in mobile hero layout
