# Dashboard Widget Design Standard

All dashboard widgets (except structural ones like `WelcomeHero`) must follow this exact 3-zone layout to ensure visual consistency across the dashboard.

## Layout Structure

```text
┌─────────────────────────────────┐
│ 🎯 TITLE                [TAG]  │  ← HEADER
│                                 │
│         ┌─────────┐             │
│         │ graphic │             │  ← BODY (centered)
│         └─────────┘             │
│      informational text         │
│                                 │
│  ┌───────────────────────────┐  │
│  │      CTA Button →         │  │  ← FOOTER (full-width CTA)
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

## Outer Wrapper

```tsx
<div className="relative h-full overflow-hidden rounded-lg border-4 border-border bg-card p-0 shadow-[4px_4px_0px_0px_hsl(var(--border))] flex flex-col">
```

- `border-4 border-border` — 4px Bean Black border
- `shadow-[4px_4px_0px_0px_hsl(var(--border))]` — hard sticker shadow
- `rounded-lg` — 8px radius
- `bg-card` — semantic card background
- `p-0` — padding handled by inner zones

## Zone 1 — Header

```tsx
<div className="flex items-center justify-between px-5 pt-5 pb-3">
  <h3 className="font-bangers text-lg flex items-center gap-2">
    <Icon className="h-5 w-5 text-{color}" />
    {title}
  </h3>
  <WidgetCategoryTag label={category} />
</div>
```

- Icon: `h-5 w-5`, colored by category (see below)
- Title: `font-bangers text-lg`
- Tag: `WidgetCategoryTag` component, upper-right

### Icon Color Conventions

| Category    | Color token   | Tag label key              |
|-------------|---------------|----------------------------|
| Learn       | `secondary`   | `widgets.categoryLearn`    |
| Experience  | `primary`     | `widgets.categoryExperience` |
| AI          | `primary`     | `widgets.categoryAI`       |
| Accent      | `accent`      | (varies)                   |

## Zone 2 — Body (Centered Content)

```tsx
<div className="px-5 pb-5 flex flex-col items-center flex-1">
  {/* Graphic element */}
  {/* Supporting text */}
  {/* CTA button — mt-auto pushes it to the bottom */}
</div>
```

### Graphic Element Options

1. **Icon circle** — for empty/count states:
   ```tsx
   <div className="w-16 h-16 rounded-full bg-{color}/20 flex items-center justify-center border-4 border-border">
     <Icon className="h-8 w-8 text-{color}" />
   </div>
   ```

2. **Progress ring** — for goal/progress widgets (see WeeklyGoalWidget, LearningHubWidget)

3. **Image thumbnail** — for content preview:
   ```tsx
   <div className="w-16 h-16 rounded-lg border-4 border-border overflow-hidden">
     <img src={url} alt={name} className="w-full h-full object-cover" />
   </div>
   ```

### Supporting Text

- Primary: `text-muted-foreground text-center mt-3`
- Secondary: `text-sm text-muted-foreground/70 mt-1 text-center`

## Zone 3 — CTA Button (Bottom)

```tsx
<Button asChild variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-4">
  <Link to={route}>{ctaLabel}</Link>
</Button>
```

### Rules

- **One CTA per widget** — never multiple buttons
- **Always full-width** — `w-full`
- **Always outline variant** — `variant="outline"`
- **Label ends with →** — e.g., "Start learning →", "View all →"
- **Spacing** — `mt-4` from the last content element

## Exceptions

- **WelcomeHeroWidget** — structural widget, no border/shadow, different layout
- **CoffeeTribeWidget / BrewingLevelWidget** — hidden widgets, follow the standard but may not appear in the grid

## Clickable Widgets

Some widgets open modals on click (Favorites, Inventory). In that case:
- Add `cursor-pointer transition-opacity hover:opacity-90` to the outer wrapper
- Add `onClick={(e) => e.stopPropagation()}` to the CTA button to prevent double-action
