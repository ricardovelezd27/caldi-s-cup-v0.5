

## Disconnect Marketplace, Recipes, and Cart from Active App

This plan removes the marketplace, recipes, and cart features from the active navigation and routing while keeping all source files intact for future reactivation.

### Changes Overview

4 files will be modified. No files will be created or deleted.

---

### 1. `src/App.tsx`
- Remove imports: `CartProvider`, `CartPage`, `MarketplaceBrowsePage`, `ProductPage`, `RoasterStorefrontPage`, `RecipesPage`, `CreateRecipePage`, `RecipeViewPage`, `EditRecipePage`
- Remove `<CartProvider>` wrapper (keep `<AuthProvider>`)
- Remove 8 `<Route>` elements: `/marketplace`, `/product/:id`, `/roaster/:id`, `/cart`, `/recipes`, `/recipes/new`, `/recipes/:id`, `/recipes/:id/edit`

### 2. `src/components/layout/Header.tsx`
- Remove `ShoppingCart` and `BookOpen` icon imports
- Remove `useCart` import and its hook call (`itemCount`)
- **Desktop nav**: Remove Marketplace link, Recipes icon, and Cart icon with badge
- **Mobile nav**: Remove Cart icon (next to hamburger), and remove Marketplace, Recipes, and Cart links from the Sheet menu

### 3. `src/constants/app.ts`
- Keep `ROUTES` object unchanged (preserves references for future reconnection)
- Update `NAV_LINKS` to only include Scanner:
```ts
export const NAV_LINKS = [
  { label: "Scanner", path: "/scanner" },
] as const;
```

### 4. `src/pages/Index.tsx`
- In `SolutionSection`, remove the "Learn More" outline button that links to `/marketplace` (lines 138-140)
- Keep the primary CTA button ("Give Caldi AI a try!")

---

### What stays active
- Home (`/`), Auth (`/auth`), Quiz (`/quiz`), Results (`/results`), Dashboard (`/dashboard`), Scanner (`/scanner`), Coffee Profile (`/coffee/:id`), 404 catch-all

### What gets disconnected (files preserved)
- Marketplace browse, Product page, Roaster storefront
- Recipes (list, create, view, edit)
- Cart and CartProvider

