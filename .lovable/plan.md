

# Plan: PROFILE-008 + PROFILE-009 — Collections to Modals & Remove Retake Quiz Button

## Changes

### 1. New: `src/features/profile/components/FavoritesModal.tsx`
Dialog wrapping the existing `FavoritesTable` content. Props: `open`, `onOpenChange`. Title: "My Favorites ❤️".

### 2. New: `src/features/profile/components/InventoryModal.tsx`
Dialog wrapping the existing `InventoryTable` content. Props: `open`, `onOpenChange`. Title: "My Inventory 📦".

### 3. Edit: `src/features/dashboard/widgets/FavoritesWidget.tsx`
- Add `useState` for modal open state
- Make the widget root div clickable (`onClick` + `cursor-pointer`)
- Add "View all →" text link at bottom
- Render `<FavoritesModal>` inside the widget

### 4. Edit: `src/features/dashboard/widgets/InventoryWidget.tsx`
- Same pattern: clickable root, "View all →" link, render `<InventoryModal>`

### 5. Edit: `src/features/profile/ProfilePage.tsx`
- Delete the Collections section (lines 55-64: Separator + section with FavoritesTable/InventoryTable)
- Delete the Retake Quiz button (lines 76-79)
- Remove unused imports: `FavoritesTable`, `InventoryTable`, `STORAGE_KEYS`, `RefreshCw`, `useNavigate`, and the `handleRetakeQuiz` function

### 6. Edit: `src/features/profile/components/index.ts`
- Add exports for `FavoritesModal` and `InventoryModal`

## Files

| File | Action |
|------|--------|
| `FavoritesModal.tsx` | Create |
| `InventoryModal.tsx` | Create |
| `FavoritesWidget.tsx` | Edit — clickable + modal |
| `InventoryWidget.tsx` | Edit — clickable + modal |
| `ProfilePage.tsx` | Edit — remove Collections section + Retake Quiz button |
| `profile/components/index.ts` | Edit — add exports |

