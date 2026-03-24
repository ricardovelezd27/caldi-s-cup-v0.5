

# Plan: Widget Reordering + Rename to "Personalize Dashboard"

## Approach

Add a `sort_order` column to `dashboard_widgets` table. Use it to order widgets. In the EditWidgetsDialog, show active widgets in a sortable list with up/down arrows. Rename all "Edit Widgets" labels to "Personalize Dashboard".

## Database Migration

Add `sort_order integer not null default 0` to `dashboard_widgets`. Backfill existing rows based on `created_at` order.

```sql
ALTER TABLE public.dashboard_widgets ADD COLUMN sort_order integer NOT NULL DEFAULT 0;

-- Backfill existing widgets with sequential order per user
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) - 1 AS rn
  FROM public.dashboard_widgets
)
UPDATE public.dashboard_widgets SET sort_order = ranked.rn FROM ranked WHERE dashboard_widgets.id = ranked.id;
```

## Code Changes

### `src/hooks/useDashboardWidgets.ts`
- Change query ordering from `created_at` to `sort_order`
- On `addWidget`, set `sort_order` to current widget count
- Add `reorderWidgets` mutation that batch-updates `sort_order` for a list of widget IDs

### `src/features/dashboard/components/EditWidgetsDialog.tsx`
- Rename button and title to "Personalize Dashboard"
- Split modal into two sections:
  1. **Active widgets** — a vertical list of currently added widgets with up/down `ChevronUp`/`ChevronDown` buttons for reordering
  2. **Available widgets** — widgets not yet added, with "Add" button
- `onReorder` prop: receives reordered array of widget IDs
- Manage local reorder state, flush on each move

### `src/features/dashboard/components/WidgetGrid.tsx`
- Pass `onReorder` and `activeWidgets` to EditWidgetsDialog
- Wire up the new `reorderWidgets` mutation
- Rename references

### `src/features/dashboard/widgets/widgetRegistry.ts`
- No changes needed (structural filter already works)

## Files Modified

| File | Change |
|------|--------|
| Migration | Add `sort_order` column + backfill |
| `useDashboardWidgets.ts` | Order by `sort_order`, add `reorderWidgets` mutation, set sort_order on add |
| `EditWidgetsDialog.tsx` | Rename to "Personalize Dashboard", add active widgets list with up/down reorder buttons |
| `WidgetGrid.tsx` | Wire reorder mutation, pass active widgets to dialog |

