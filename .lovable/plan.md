

# Plan: Unregister CoffeeTribeWidget and BrewingLevelWidget

## Problem

The `WIDGET_REGISTRY` is typed as `Record<WidgetType, WidgetRegistryEntry>`, requiring an entry for every enum value. We can't simply delete entries without a type error. The enum still exists in the DB so we won't remove it.

## Approach

Change the registry type from `Record<WidgetType, ...>` to `Partial<Record<WidgetType, ...>>` so entries can be omitted. Then remove the two widget entries and their imports. Add the two types to the `STRUCTURAL_WIDGETS` exclusion list (renamed to `HIDDEN_WIDGETS`) so they never appear in the "Add Widget" dialog. Update any code that reads from the registry to handle possibly-undefined entries.

## Changes

### 1. `src/features/dashboard/widgets/widgetRegistry.ts`
- Change type to `Partial<Record<WidgetType, WidgetRegistryEntry>>`
- Remove `coffee_tribe` and `brewing_level` entries + their imports
- Rename `STRUCTURAL_WIDGETS` to include these hidden types, or just filter by presence in registry

### 2. `src/features/dashboard/widgets/types.ts`
- No changes needed (WidgetType stays as the DB enum)

### 3. `src/features/dashboard/components/WidgetGrid.tsx` / `WidgetWrapper.tsx`
- Add a guard: if `WIDGET_REGISTRY[widget.widgetType]` is undefined, skip rendering that widget (handles existing DB rows for users who had these widgets)

### 4. `src/features/dashboard/widgets/index.ts`
- Remove re-exports of `CoffeeTribeWidget` and `BrewingLevelWidget`

### 5. `src/features/dashboard/components/EditWidgetsDialog.tsx`
- Already driven by `getAvailableWidgets()` which reads from registry, so removing entries automatically hides them from the add list

## Files Modified

| File | Change |
|------|--------|
| `widgetRegistry.ts` | Remove 2 entries, change to Partial type, remove imports |
| `widgets/index.ts` | Remove 2 re-exports |
| `WidgetGrid.tsx` or `WidgetWrapper.tsx` | Guard against undefined registry entries |

