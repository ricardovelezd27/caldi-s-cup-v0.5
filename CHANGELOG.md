# Changelog

All notable changes to Caldi's Cup are documented here.

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
