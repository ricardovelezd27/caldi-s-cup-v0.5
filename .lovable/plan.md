

# Plan: Merge Edit + Add Widget into Single "Edit Widgets" Button

## Problem
Two separate buttons ("Add Widget" and "Edit") create a confusing flow — the modal shows widgets but you can't remove them without toggling Edit mode separately.

## Solution
Combine both into one "Edit Widgets" button that opens the modal with add AND remove capabilities built in.

### `src/features/dashboard/components/AddWidgetDialog.tsx`
- Rename to `EditWidgetsDialog`
- Change trigger button text to "Edit Widgets" (with `Settings` icon instead of `Plus`)
- Add `onRemove` prop to allow removing existing widgets from inside the modal
- For already-added widgets: show a "Remove" button instead of just a checkmark
- For not-yet-added widgets: keep the current "click to add" behavior
- When dialog opens, also set `isEditing=true` on the parent; when it closes, set `isEditing=false`

### `src/features/dashboard/components/WidgetGrid.tsx`
- Remove the standalone "Edit" `Button` and `Settings` import
- Remove `isEditing` local state — derive it from the dialog's open state instead
- Pass `onRemove` handler into the renamed dialog
- The dialog's open/close now controls `isEditing` for `WidgetWrapper` overlays

### `src/features/dashboard/components/WidgetWrapper.tsx`
- No changes needed — it already responds to `isEditing` prop

## Files Modified

| File | Change |
|------|--------|
| `AddWidgetDialog.tsx` | Rename, add remove capability, change trigger to "Edit Widgets" |
| `WidgetGrid.tsx` | Remove Edit button, tie `isEditing` to dialog open state |

