

## Code Audit and Optimization Plan

### Audit Summary

After a thorough review of the codebase, I identified several categories of dead or orphaned code that can be safely cleaned up without touching any dormant features (marketplace, recipes, cart files are preserved per your standing rule).

---

### Category 1: Orphaned Utility Files (zero active consumers)

These files exist only to serve the dormant cart/marketplace system and have **no imports from any active feature**:

| File | Why Orphaned |
|------|-------------|
| `src/hooks/useOptimisticCart.ts` | Only self-referencing. Never imported anywhere. Cart system is dormant. |
| `src/utils/rateLimit.ts` | Only imported by `useOptimisticCart.ts` (orphaned). No other consumer. |
| `src/utils/formatters.ts` | Only imported by dormant `CartItemRow.tsx` and `OrderSummary.tsx`. No active feature uses it. |
| `src/schemas/cart.schema.ts` | Only imported by `src/utils/validation/cartValidation.ts`, which itself is only imported by `localCartService.ts` (dormant cart chain). |
| `src/utils/validation/cartValidation.ts` | Same -- only used by the dormant cart service. |

**Decision**: These are NOT dormant features themselves -- they are orphaned utilities. Per the standing rule, dormant **features** (marketplace, recipes, cart pages/components) are preserved. But these standalone utility hooks and validators have zero active consumers and should be flagged.

**Recommendation**: Leave them in place but add a `@dormant` JSDoc tag at the top of each file indicating they belong to the inactive cart pipeline. This keeps the code clean without deleting it.

---

### Category 2: Duplicate Toast System

The app runs **two parallel toast systems**:
- **shadcn/ui Toaster** (`src/hooks/use-toast.ts` + `src/components/ui/toaster.tsx` + `src/components/ui/toast.tsx`)
- **Sonner** (`sonner` package + `src/components/ui/sonner.tsx`)

Both are mounted in `App.tsx`. Active components are split between them -- some use `import { toast } from "sonner"` and others use `import { useToast } from "@/hooks/use-toast"`.

Additionally, `src/components/ui/use-toast.ts` is a **dead re-export wrapper** -- it imports from `@/hooks/use-toast` and re-exports, but nothing imports from it.

**Action**:
- Delete `src/components/ui/use-toast.ts` (dead file, zero consumers).
- No other toast consolidation needed right now -- both systems are actively used by different components.

---

### Category 3: Unused Auth Guard Components

`RequireRole` and `ShowForRole` are exported from `src/components/auth/index.ts` and defined in `RequireRole.tsx`, but **never imported or used anywhere** in the app's routes or components.

**Action**: Remove the export line from `src/components/auth/index.ts`. Keep the file `RequireRole.tsx` itself (it's a useful guard for future roaster/admin routes, so it falls under "dormant feature infrastructure"). Just clean the barrel export so it doesn't advertise unused components.

---

### Category 4: Stale ROUTES Constants

`src/constants/app.ts` defines `ROUTES.marketplace`, `ROUTES.recipes`, and `ROUTES.cart`, but these routes are not registered in `App.tsx` and have no active navigation links.

**Action**: Add a comment block marking these as reserved for dormant features, improving clarity for future developers.

---

### Category 5: Redundant OfflineIndicator Text

`src/components/error/OfflineIndicator.tsx` has a hardcoded English string ("You're offline...") that was missed during the i18n sweep.

**Action**: Replace with `t('shared.offlineMessage')` and add the key to both dictionaries.

---

### Category 6: Minor Code Quality Improvements

1. **`AuthCard.tsx`**: Missing `font-bangers` class on the `h1` (all other headings use it per style guide).
2. **`src/features/coffee/types/coffee.ts` line 132-133**: Uses `(row as any)` cast for `brand_story`, `jargon_explanations`, `ai_confidence`. If these columns exist in the DB schema, we should use proper typing. If not, these are dead code paths.

---

### Files to Modify

| File | Change |
|------|--------|
| `src/components/ui/use-toast.ts` | Delete (dead re-export, zero consumers) |
| `src/hooks/useOptimisticCart.ts` | Add `@dormant` JSDoc marker |
| `src/utils/rateLimit.ts` | Add `@dormant` JSDoc marker |
| `src/utils/formatters.ts` | Add `@dormant` JSDoc marker |
| `src/schemas/cart.schema.ts` | Add `@dormant` JSDoc marker |
| `src/utils/validation/cartValidation.ts` | Add `@dormant` JSDoc marker |
| `src/components/auth/index.ts` | Remove `RequireRole`/`ShowForRole` from barrel export |
| `src/constants/app.ts` | Add "dormant" comment on unused ROUTES |
| `src/components/error/OfflineIndicator.tsx` | Replace hardcoded string with `t()` |
| `src/i18n/en.ts` | Add `shared.offlineMessage` key |
| `src/i18n/es.ts` | Add `shared.offlineMessage` key |
| `src/components/auth/AuthCard.tsx` | Add `font-bangers` to heading |

### What This Does NOT Touch
- Marketplace, recipes, cart feature folders (preserved per standing rule)
- Any active routes, components, or services
- Database schema or migrations
- Edge functions

### Estimated Impact
- 1 dead file deleted
- ~6 files annotated with dormant markers
- 5 files with minor targeted improvements
- Zero risk of breaking active functionality
