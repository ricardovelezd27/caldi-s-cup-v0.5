
# Codebase Cleanup & Optimization Plan

This plan addresses the critical bugs, zombie code, and type duplications identified in the codebase review following the implementation of Phases A-G.

---

## Executive Summary

| Category | Files Affected | Impact |
|----------|---------------|--------|
| Critical Bug | 1 file | Dashboard favorites widget broken |
| Zombie Code | 17 files (~2,200 lines) | Bundle bloat, confusion |
| Type Duplication | 2 files | Maintenance risk |
| Barrel Export Cleanup | 2 files | Cleaner imports |

---

## Phase 1: Critical Bug Fix (Priority: HIGH)

### Problem
`useDashboardData.ts` queries a non-existent table `user_favorites`. The actual table is `user_favorites` but it stores different data than expected. The `FavoritesWidget` expects coffee details but the table stores simple favorites.

### Solution
Update `useDashboardData` to query `user_favorites` correctly. The table schema already matches the `FavoriteCoffee` interface (coffee_name, roaster_name, image_url, rating).

### Changes
```text
File: src/features/dashboard/hooks/useDashboardData.ts
Line 59: Change "user_favorites" query to use correct table name
         (Note: Table is already named user_favorites - verify it exists)
         
Action: Verify table exists and query is correct, or update to use
        user_coffee_favorites with a join to coffees table
```

### Technical Details
- Current query at line 59 references `user_favorites`
- Database has both `user_favorites` (text-based) and `user_coffee_favorites` (UUID references)
- Need to decide: keep using text-based `user_favorites` OR migrate to join-based approach
- Recommendation: Keep `user_favorites` as-is since it already has the right schema

---

## Phase 2: Type Consolidation

### 2A: Widget Types (Single Source of Truth)

**Current State:**
- `src/types/dashboard.ts` lines 3-26: Widget types + `transformWidget`
- `src/features/dashboard/widgets/types.ts` lines 4-27: Same Widget types + extra widget-specific interfaces

**Solution:** Keep `src/features/dashboard/widgets/types.ts` as the source of truth (feature-scoped), update imports.

**Files to Modify:**
```text
1. src/types/dashboard.ts
   - Remove: WidgetType, WidgetPosition, WidgetConfig, DashboardWidget (lines 3-26)
   - Remove: transformWidget function (lines 45-62)
   - Keep: Recipe-related code temporarily (removed in 2B)

2. src/hooks/useDashboardWidgets.ts
   - Update import: from "@/features/dashboard/widgets/types" instead of "@/types/dashboard"

3. src/features/dashboard/widgets/types.ts
   - Add: transformWidget function (moved from src/types/dashboard.ts)
```

### 2B: Recipe Types

**Current State:**
- `src/types/dashboard.ts` lines 28-43: Duplicate `Recipe` interface
- `src/types/dashboard.ts` lines 64-83: Unused `transformRecipe` function
- `src/features/recipes/types/recipe.ts`: Active Recipe types (source of truth)

**Solution:** Remove Recipe-related code from `src/types/dashboard.ts`.

**Files to Modify:**
```text
1. src/types/dashboard.ts
   - After Phase 2A: File will be nearly empty
   - Delete entire file OR keep only if other non-duplicate types remain
```

---

## Phase 3: Zombie Code Removal

### 3A: Legacy Dashboard Components (6 files, ~420 lines)

These components have been replaced by the Widget system:

| File to Delete | Replaced By |
|----------------|-------------|
| `WelcomeHero.tsx` | `WelcomeHeroWidget.tsx` |
| `UserTypeCard.tsx` | `CoffeeTribeWidget.tsx` |
| `RecentBrewsCard.tsx` | `RecentBrewsWidget.tsx` |
| `FavoriteCoffeeCard.tsx` | `FavoritesWidget.tsx` |
| `WeeklyGoalCard.tsx` | `WeeklyGoalWidget.tsx` |
| `BrewingLevelCard.tsx` | `BrewingLevelWidget.tsx` |

**Files to Modify:**
```text
DELETE:
- src/features/dashboard/components/WelcomeHero.tsx
- src/features/dashboard/components/UserTypeCard.tsx  
- src/features/dashboard/components/RecentBrewsCard.tsx
- src/features/dashboard/components/FavoriteCoffeeCard.tsx
- src/features/dashboard/components/WeeklyGoalCard.tsx
- src/features/dashboard/components/BrewingLevelCard.tsx

UPDATE:
- src/features/dashboard/components/index.ts
  Remove legacy exports (lines ~8-13)
```

### 3B: Legacy Scanner Components (11 files, ~850 lines)

These components have been replaced by the Unified Coffee Profile system:

| File to Delete | Replaced By |
|----------------|-------------|
| `ScanResultsImage.tsx` | `CoffeeImage.tsx` |
| `ScanResultsInfo.tsx` | `CoffeeInfo.tsx` |
| `ScanResultsAttributes.tsx` | `CoffeeAttributes.tsx` |
| `ScanResultsMatch.tsx` | `CoffeeScanMatch.tsx` |
| `ScanResultsFlavorNotes.tsx` | `CoffeeFlavorNotes.tsx` |
| `ScanResultsAccordions.tsx` | `CoffeeProfile.tsx` internals |
| `ScanResultsActions.tsx` | `CoffeeActions.tsx` |
| `ExtractedDataCard.tsx` | `CoffeeProfile.tsx` grid |
| `EnrichedDataCard.tsx` | `CoffeeProfile.tsx` grid |
| `PreferenceMatchCard.tsx` | `CoffeeScanMatch.tsx` |
| `JargonBuster.tsx` | `CoffeeJargonBuster.tsx` |

**Files to Modify:**
```text
DELETE:
- src/features/scanner/components/ScanResultsImage.tsx
- src/features/scanner/components/ScanResultsInfo.tsx
- src/features/scanner/components/ScanResultsAttributes.tsx
- src/features/scanner/components/ScanResultsMatch.tsx
- src/features/scanner/components/ScanResultsFlavorNotes.tsx
- src/features/scanner/components/ScanResultsAccordions.tsx
- src/features/scanner/components/ScanResultsActions.tsx
- src/features/scanner/components/ExtractedDataCard.tsx
- src/features/scanner/components/EnrichedDataCard.tsx
- src/features/scanner/components/PreferenceMatchCard.tsx
- src/features/scanner/components/JargonBuster.tsx

UPDATE:
- src/features/scanner/components/index.ts
  Keep only: ScanUploader, TribeScannerPreview, ScanningTips, ScanProgress, ScanResults
```

---

## Phase 4: Barrel Export Cleanup

### 4A: Dashboard Components Index
```text
File: src/features/dashboard/components/index.ts

BEFORE (11 exports):
- DashboardSidebar, WidgetGrid, WidgetWrapper, AddWidgetDialog (active)
- WelcomeHero, UserTypeCard, RecentBrewsCard, FavoriteCoffeeCard, 
  WeeklyGoalCard, BrewingLevelCard (legacy - remove)

AFTER (4 exports):
export { DashboardSidebar } from "./DashboardSidebar";
export { WidgetGrid } from "./WidgetGrid";
export { WidgetWrapper } from "./WidgetWrapper";
export { AddWidgetDialog } from "./AddWidgetDialog";
```

### 4B: Scanner Components Index
```text
File: src/features/scanner/components/index.ts

BEFORE (18 exports):
- 5 active components
- 13 legacy components marked "for backward compatibility"

AFTER (5 exports):
export { ScanUploader } from "./ScanUploader";
export { TribeScannerPreview } from "./TribeScannerPreview";
export { ScanningTips } from "./ScanningTips";
export { ScanProgress } from "./ScanProgress";
export { ScanResults } from "./ScanResults";
```

---

## Implementation Order

Recommended sequence to minimize risk:

```text
Step 1: Fix useDashboardData (Phase 1)
        - Critical bug fix, immediate impact
        - Test: Dashboard favorites widget loads without error

Step 2: Consolidate Widget types (Phase 2A)
        - Move transformWidget to feature folder
        - Update imports in useDashboardWidgets.ts
        - Test: Dashboard still loads, widgets work

Step 3: Remove Recipe duplication (Phase 2B)  
        - Delete Recipe/transformRecipe from src/types/dashboard.ts
        - If file becomes empty, delete it
        - Test: Recipe CRUD still works

Step 4: Delete legacy dashboard components (Phase 3A)
        - Delete 6 component files
        - Update index.ts
        - Test: Dashboard renders correctly

Step 5: Delete legacy scanner components (Phase 3B)
        - Delete 11 component files
        - Update index.ts
        - Test: Scanner flow works end-to-end

Step 6: Final barrel cleanup (Phase 4)
        - Already done in Steps 4-5
        - Verify no broken imports across codebase
```

---

## Validation Checklist

After implementation, verify:

- [ ] Dashboard loads without console errors
- [ ] FavoritesWidget displays favorite coffee (or empty state)
- [ ] Scanner flow: upload -> scan -> results display correctly
- [ ] Recipe CRUD: create, view, edit, delete all work
- [ ] Widget system: add/remove widgets works
- [ ] No TypeScript compilation errors
- [ ] No broken imports

---

## Summary of Deletions

| Category | Files | Lines Removed (approx) |
|----------|-------|------------------------|
| Legacy Dashboard | 6 | ~420 |
| Legacy Scanner | 11 | ~850 |
| Type Duplicates | 2 (partial) | ~60 |
| **Total** | **17-19** | **~1,330** |

This cleanup reduces bundle size, eliminates confusion between legacy and active components, and establishes clear sources of truth for shared types.
