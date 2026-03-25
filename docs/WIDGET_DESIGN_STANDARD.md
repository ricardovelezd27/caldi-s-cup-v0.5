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
<div className="relative h-full overflow-hidden rounded-lg border-4 border-border bg-card p-0 shadow-[4px_4px_0px_0px_hsl(var(--border))] flex flex-col min-h-[320px]">
```

- `min-h-[320px]` — minimum height for breathing room (applied via grid cell or widget itself)

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

2. **Progress ring** — for goal/progress widgets (see LearningHubWidget)

3. **Preview list** — for widgets with scannable/inventory items (RecentScans, Inventory):
   ```tsx
   <ul className="w-full space-y-2">
     <li className="flex items-center gap-2 px-3 py-2">
       <Icon className="h-4 w-4 text-{color} shrink-0" />
       <div className="min-w-0 flex-1">
         <p className="text-sm font-medium truncate text-foreground">{name}</p>
         <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
       </div>
     </li>
   </ul>
   ```
   - No borders on list items — keep them clean
   - Limit to 3 items max

4. **Image thumbnail** — for content preview:
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
<Button asChild variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-auto">
  <Link to={route}>{ctaLabel}</Link>
</Button>
```

### Rules

- **One CTA per widget** — never multiple buttons
- **Always full-width** — `w-full`
- **Always outline variant** — `variant="outline"`
- **Label ends with →** — e.g., "Start learning →", "View all →"
- **Spacing** — `mt-auto` to push CTA to the bottom of the widget (outer wrapper must be `flex flex-col`, body must be `flex-1`)

## Exceptions

- **WelcomeHeroWidget** — structural widget, no border/shadow, different layout. Text hierarchy: tribe intro `text-lg font-medium`, description `text-base`, values pills `text-xs`, rank badge `text-sm`, progress label `text-sm`. All tribe text uses `t()` i18n keys (`tribes.{id}.name/title/description/values`).
- **CoffeeTribeWidget / BrewingLevelWidget** — hidden widgets, follow the standard but may not appear in the grid

## i18n for Tribe Content

All tribe-related text (name, title, description, values) must use `t("tribes.{tribe}.{field}")` — never read directly from `tribes.ts` definitions. The `values` field is stored as a comma-separated string in i18n dictionaries and split at render time: `t("tribes.owl.values").split(",")`.

## FeedbackCTA

The `FeedbackCTA` component is intentionally unstyled (no border, shadow, or card background) to visually distinguish it from dashboard widgets. It appears at the bottom of key pages (Profile, Scanner, Coffee Profile) as a lightweight feedback prompt.

## Clickable Widgets

Some widgets open modals on click (Favorites, Inventory). In that case:
- Add `cursor-pointer transition-opacity hover:opacity-90` to the outer wrapper
- Add `onClick={(e) => e.stopPropagation()}` to the CTA button to prevent double-action
