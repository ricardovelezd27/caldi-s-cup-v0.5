

## Plan: Fix Tribe Text Hierarchy, Spacing, and Widget Height

### Issues from Screenshots
1. **Tribe description text too small** — `text-sm` and `text-xs` in WelcomeHeroWidget lose hierarchy vs widget content
2. **Too much gap** between profile picture area and tribe section (WelcomeHeroWidget)
3. **Widgets feel cramped** — CTA buttons crowd the content above (visible in Learning Hub, Recent Scans, Inventory)

### Changes

#### 1. WelcomeHeroWidget — Increase tribe text size + reduce top spacing
- Tribe intro: `text-sm` → `text-base` ("You're a **The Owl** — the optimizer.")
- Tribe description: `text-xs` → `text-sm`
- Tribe values pills: `text-[10px]` → `text-xs`
- Reduce top padding or margin to bring tribe section closer to profile picture

#### 2. All grid widgets — Add minimum height for breathing room
In `WidgetGrid.tsx`, add `min-h-[320px]` to each widget grid cell so content doesn't feel squeezed against the CTA. This gives the body zone more vertical space.

#### 3. Widget body zone — Add spacing before CTA
Ensure all widgets have `gap-3` or equivalent spacing in the body flex column, so the CTA doesn't sit flush against list items or text.

#### 4. Update `docs/WIDGET_DESIGN_STANDARD.md`
- Document the `min-h-[320px]` on grid cells
- Note updated text sizes for WelcomeHeroWidget

### Files to Modify
- `src/features/dashboard/widgets/WelcomeHeroWidget.tsx` — text sizes + spacing
- `src/features/dashboard/components/WidgetGrid.tsx` — min-height on grid cells
- `docs/WIDGET_DESIGN_STANDARD.md` — update standards

