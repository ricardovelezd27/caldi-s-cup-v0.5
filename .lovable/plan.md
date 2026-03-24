

# Plan: Use Pill-Style Stat Cards on All Screen Sizes

## What Changes

Make the stat cards always render in the compact "pill" format (horizontal scrollable row) regardless of screen size. This removes the `useIsMobile` hook dependency and the conditional layout logic.

## `src/features/profile/ProfilePage.tsx`

1. Remove `useIsMobile` import and usage
2. Replace the conditional layout with a single `flex flex-wrap gap-3` container
3. Always pass `compact` (or remove the prop entirely since it's always true)
4. Remove the `hidden md:block` heading since pills are self-explanatory

```tsx
{/* 📊 Stats Row */}
<section>
  <div className="flex flex-wrap gap-3">
    <ProfileStreakCard compact />
    <ProfileDailyGoalCard compact />
    <ProfileXPCard compact />
    <ProfileFavoritesCard compact />
    <ProfileInventoryCard compact />
  </div>
</section>
```

| File | Change |
|------|--------|
| `src/features/profile/ProfilePage.tsx` | Remove `useIsMobile`, use pill layout always |

