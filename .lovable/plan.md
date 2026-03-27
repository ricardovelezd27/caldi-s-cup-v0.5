

## Plan: Add Delete Button for Sections

### Problem
The TrackDetailPage has delete buttons for units but not for sections. The user needs to delete the "History & Culture" **section** inside the "Bean Knowledge" track.

### Changes

**File: `src/features/admin/learning/pages/TrackDetailPage.tsx`**

1. Add a separate `deleteSectionTarget` state (to avoid confusion with the existing unit delete state)
2. Add a delete (trash) button in each section's `CardHeader`, next to the section name, stopping event propagation so it doesn't toggle the collapsible
3. Add a second `AlertDialog` for section deletion with a clear warning that it will delete all nested units, lessons, and exercises
4. The delete handler calls `deleteEntity("learning_sections", id)` and invalidates both sections and units queries

The delete button will use the section's unique `id` (UUID), so even if two sections share the same display name, only the correct one is deleted.

### UI Layout
Each section header will have a small red trash icon button on the right side (before the chevron), matching the existing unit delete button style.

### Files to Change

| File | Change |
|---|---|
| `TrackDetailPage.tsx` | Add `deleteSectionTarget` state, trash button per section header, and confirmation AlertDialog for section deletion |

