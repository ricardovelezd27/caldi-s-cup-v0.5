

# Plan: Homogenize Widget UI to Branded Retro Box Style

## What

Replace `<Card>`, `<CardHeader>`, `<CardTitle>`, and `<CardContent>` with plain `<div>` and `<h3>` elements using the same retro border/shadow style as `WelcomeHeroWidget` across all 7 active widgets.

## Target Style

```
Root:    <div className="relative h-full overflow-hidden rounded-lg border-4 border-border bg-card p-0 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
Header:  <div className="flex items-center justify-between px-5 pt-5 pb-3">
Title:   <h3 className="font-bangers text-lg flex items-center gap-2">
Content: <div className="px-5 pb-5">
```

## Widgets to Update (7 files)

| Widget | Notes |
|--------|-------|
| `WeeklyGoalWidget.tsx` | Standard Card → retro div |
| `RecentBrewsWidget.tsx` | Standard Card → retro div |
| `FavoritesWidget.tsx` | Standard Card → retro div |
| `InventoryWidget.tsx` | Standard Card → retro div |
| `RecentScansWidget.tsx` | Standard Card → retro div |
| `RecommendationsWidget.tsx` | Standard Card → retro div |
| `QuickScanWidget.tsx` | Card with gradient → retro div, keep gradient via inline style or extra classes |

**WelcomeHeroWidget** — already correct, no changes.

Each file: remove `Card`/`CardHeader`/`CardTitle`/`CardContent` imports, replace JSX with the plain div structure, keep all internal logic and content unchanged.

