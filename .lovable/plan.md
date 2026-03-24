

# Plan: Integrate Stats into Widgets

## Changes

### 1. `src/features/dashboard/widgets/WeeklyGoalWidget.tsx`
- Import `useStreak` from `@/hooks/gamification/useStreak`
- After the goal status text (line 63-69), add a conditional streak line:
```tsx
{streak && streak.currentStreak > 0 && (
  <p className="text-xs text-muted-foreground mt-1">
    🔥 {streak.currentStreak} day streak
  </p>
)}
```

### 2. `src/features/dashboard/widgets/FavoritesWidget.tsx`
- Import `useFavorites` from `@/features/coffee/hooks/useFavorites`
- Change title from `Favorite Coffee` to `Favorites ({favoriteIds.length})` when count > 0, otherwise just `Favorites`

### 3. `src/features/dashboard/widgets/InventoryWidget.tsx`
- Query total inventory count (separate count query without the `.limit(4)`)
- Change title from `My Inventory` to `My Inventory ({totalCount})` when count > 0, otherwise just `My Inventory`

## Files Modified

| File | Change |
|------|--------|
| `WeeklyGoalWidget.tsx` | Add streak indicator at bottom |
| `FavoritesWidget.tsx` | Add favorites count to title |
| `InventoryWidget.tsx` | Add inventory count to title |

