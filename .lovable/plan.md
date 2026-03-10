

# Plan: Profile Page Redesign — Gamification vs Coffee Stats Split

## Overview

Redesign ProfilePage and ProfileHero to separate "Learning Journey" gamification widgets from "Coffee Hub" widgets in a responsive 12-column grid, with standardized card styling across all widget components.

---

## Part A: ProfileHero.tsx Refactor

**Current**: Avatar + info side-by-side on all sizes, badges inline with name.

**New layout**:
- Remove all gamification badges (streak, daily goal, favorites count, inventory count) from the hero — these move to the page grid sections
- Keep: cover image, avatar, name, email, edit button, ProfileRankRow
- **Mobile**: Avatar and info centered vertically (`flex flex-col items-center text-center`)
- **Desktop**: Side-by-side (`md:flex-row md:items-start md:text-left`)
- ProfileRankRow moves below the avatar/info block, spanning full width (`w-full mt-6`)
- Remove imports for StreakDisplay, DailyGoalRing, useFavorites, useInventory, Heart, Package from this component

## Part B: ProfilePage.tsx Refactor

**Current**: Simple 2-column grids with TribeSection, RetakeQuizSection, FavoritesTable, InventoryTable.

**New structure**:
```text
┌─────────────────────────────────────────────────┐
│                  ProfileHero                     │
├──────────────────────┬──────────────────────────┤
│  Learning Journey    │   My Coffee Hub           │
│  (col-span-7)        │   (col-span-5)            │
│  ┌────┬────┬────┐    │   ┌────────┬────────┐     │
│  │Strk│Goal│ XP │    │   │Favs    │Invntry │     │
│  └────┴────┴────┘    │   └────────┴────────┘     │
│                      │   ┌─────────────────┐     │
│                      │   │  TribeSection    │     │
│                      │   └─────────────────┘     │
├──────────────────────┴──────────────────────────┤
│  ⚙️ Account & Settings                          │
│  [Edit Profile] [Retake Quiz]                    │
├─────────────────────────────────────────────────┤
│  FeedbackCTA                                     │
└─────────────────────────────────────────────────┘
```

- Main container: `grid grid-cols-12 gap-8`
- **Learning Journey** (`col-span-12 md:col-span-7`): Section header, inner `grid grid-cols-2 md:grid-cols-3 gap-4` with StreakCard, DailyGoalCard, XPCard. Third card uses `col-span-2 md:col-span-1` to span full width on mobile
- **Coffee Hub** (`col-span-12 md:col-span-5`): Section header, inner `grid grid-cols-2 gap-4` with FavoritesCard and InventoryCard, plus TribeSection below spanning full width
- **Account section**: Below the grid (`w-full mt-12`), contains Edit Profile button (opens existing dialog) and Retake Quiz button in a `flex flex-col gap-3 max-w-md` layout

## Part C: Standardized Widget Cards

Create new profile-specific stat card components (not modifying the dashboard widgets or the lesson gamification components, which serve different contexts).

### New components in `src/features/profile/components/`:

**ProfileStatCard.tsx** — Reusable card wrapper:
- Container: `rounded-lg border bg-card p-6 flex flex-col items-center justify-center text-center`
- Layout: icon circle top → metric middle → label bottom

**ProfileStreakCard.tsx**:
- Icon: Flame in `bg-orange-100 text-orange-600` circle
- Metric: current streak number
- Label: "Day Streak"

**ProfileDailyGoalCard.tsx**:
- Icon: Target in `bg-blue-100 text-blue-600` circle
- Metric: `earnedXp/goalXp` XP or "Not set"
- Label: "Daily Goal"

**ProfileXPCard.tsx**:
- Icon: Star in `bg-yellow-100 text-yellow-600` circle
- Metric: total XP from useUserRank
- Label: "Total XP"

**ProfileFavoritesCard.tsx**:
- Icon: Heart in `bg-rose-100 text-rose-600` circle
- Metric: favorites count
- Label: "Favorites"
- Clickable → links to expanded FavoritesTable or scrolls

**ProfileInventoryCard.tsx**:
- Icon: Package in `bg-amber-100 text-amber-700` circle
- Metric: inventory count
- Label: "In Inventory"

All cards use the same `ProfileStatCard` base for consistency.

## Files Changed

| File | Action |
|------|--------|
| `ProfileHero.tsx` | Edit — remove badges, responsive centered/side-by-side layout |
| `ProfilePage.tsx` | Edit — 12-col grid with Learning Journey + Coffee Hub sections + Account section |
| `profile/components/ProfileStatCard.tsx` | Create — reusable icon-metric-label card |
| `profile/components/ProfileStreakCard.tsx` | Create |
| `profile/components/ProfileDailyGoalCard.tsx` | Create |
| `profile/components/ProfileXPCard.tsx` | Create |
| `profile/components/ProfileFavoritesCard.tsx` | Create |
| `profile/components/ProfileInventoryCard.tsx` | Create |
| `profile/components/index.ts` | Edit — add new exports |

The existing `StreakDisplay`, `DailyGoalRing`, `XPCounter`, `FavoritesWidget`, `InventoryWidget` in their original locations remain unchanged (used elsewhere in dashboard/lessons).

