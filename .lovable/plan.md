

# Plan: Remove Stats Bar from Profile Page

## Change

In `src/features/profile/ProfilePage.tsx`:

1. Delete lines 53-64 (the stats `<section>` and the `<Separator>` below it)
2. Remove unused imports: `ProfileStreakCard`, `ProfileDailyGoalCard`, `ProfileXPCard`, `ProfileFavoritesCard`, `ProfileInventoryCard`, and `Separator`

The "My Dashboard" widget grid will appear directly below `<ProfileHero />`.

## Files Modified

| File | Change |
|------|--------|
| `ProfilePage.tsx` | Remove stats section, separator, and unused imports |

