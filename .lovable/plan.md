

## Plan: Standardize All Dashboard Widgets to Match WeeklyGoal Layout

### Reference Layout (WeeklyGoalWidget)
```text
┌─────────────────────────────────┐
│ 🎯 TITLE                [TAG]  │  ← Header: icon + font-bangers title left, category tag right
│                                 │
│         ┌─────────┐             │
│         │ graphic │             │  ← Center: visual/graphic + supporting text
│         └─────────┘             │
│      informational text         │
│                                 │
│    ┌─────────────────────┐      │
│    │   CTA Button →      │      │  ← Bottom: full-width outline CTA button
│    └─────────────────────┘      │
└─────────────────────────────────┘
```

### Widgets to Update (6 total)

**1. QuickScanWidget** — Already close. Make CTA button full-width (`w-full`).

**2. RecommendationsWidget** — No CTA button. Add a full-width "Browse marketplace →" outline CTA at the bottom.

**3. RecentBrewsWidget** — Uses a table layout in its populated state. Restructure: show a Coffee icon + count as the center graphic, supporting text below, full-width CTA "View brews →". In empty state, same pattern as others.

**4. FavoritesWidget** — Has two buttons (scan link + "View all"). Remove the scan link, keep only one full-width CTA "View all →" at the bottom. Center the favorite coffee preview as the graphic.

**5. InventoryWidget** — Has a grid of items + "View all" button. Restructure: show Package icon + count as center graphic, supporting text, single full-width CTA "View all →".

**6. RecentScansWidget** — Shows a list of scans + "Scan more" button. Restructure: show scan count/icon as center graphic, supporting text, full-width CTA. In empty state, already matches.

**7. LearningHubWidget** — Currently horizontal layout (ring + stats side-by-side). Restructure to vertical: ring centered, stats text below, full-width CTA at bottom.

**WelcomeHeroWidget** — Excluded (structural widget, intentionally different — no border/shadow).

### Standardized Widget Structure (code pattern)
Every widget follows this exact wrapper:
```tsx
<div className="relative h-full overflow-hidden rounded-lg border-4 border-border bg-card p-0 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
  {/* HEADER */}
  <div className="flex items-center justify-between px-5 pt-5 pb-3">
    <h3 className="font-bangers text-lg flex items-center gap-2">
      <Icon className="h-5 w-5 text-{color}" />
      {title}
    </h3>
    <WidgetCategoryTag label={category} />
  </div>
  {/* BODY: centered content + full-width CTA */}
  <div className="px-5 pb-5 flex flex-col items-center justify-center py-4">
    {/* Graphic element (icon circle, ring, image) */}
    {/* Supporting text */}
    {/* Full-width CTA */}
    <Button asChild variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-4">
      <Link to={route}>{ctaLabel}</Link>
    </Button>
  </div>
</div>
```

### New Documentation File
Create `docs/WIDGET_DESIGN_STANDARD.md` documenting:
- The 3-zone layout (header, center content, bottom CTA)
- CSS classes for the outer wrapper, header, body
- Rules: one CTA per widget, always full-width outline button, centered graphic in body
- Icon color conventions per category (secondary for Learn, primary for Experience, accent for others)

### Files to Modify
- `src/features/dashboard/widgets/QuickScanWidget.tsx` — CTA `w-full`
- `src/features/dashboard/widgets/RecommendationsWidget.tsx` — add CTA
- `src/features/dashboard/widgets/RecentBrewsWidget.tsx` — vertical center layout
- `src/features/dashboard/widgets/FavoritesWidget.tsx` — single CTA, centered content
- `src/features/dashboard/widgets/InventoryWidget.tsx` — center graphic + single CTA
- `src/features/dashboard/widgets/RecentScansWidget.tsx` — center graphic + single CTA
- `src/features/dashboard/widgets/LearningHubWidget.tsx` — vertical layout

### Files to Create
- `docs/WIDGET_DESIGN_STANDARD.md`

### i18n Keys to Add
| Key | EN | ES |
|---|---|---|
| `widgets.viewBrews` | View brews → | Ver preparaciones → |
| `widgets.browseMarketplace` | Browse marketplace → | Explorar tienda → |

