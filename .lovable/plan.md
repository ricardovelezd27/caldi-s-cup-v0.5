

# Plan: Fix Gamification XP Not Reflecting on Profile

## Root Cause Analysis

Two distinct bugs prevent XP from showing on the profile:

### Bug 1: Lesson XP never reaches `profiles.total_xp`
The lesson completion flow in `LessonScreen.tsx` calls `updateStreakViaRPC()`, which updates `learning_user_streaks.total_xp` only. It never calls the global `awardXP()` from `xpService.ts`, which is the function that increments `profiles.total_xp`. The profile page and `useUserRank` hook read from `profiles.total_xp`, so lesson XP is invisible.

### Bug 2: Profile data is stale after earning XP
After completing a lesson and navigating to `/profile`, `AuthContext.profile` still holds the old cached value. `refreshProfile()` is never called after XP changes.

### Bug 3: Desktop profile shows no XP at all
The `ProfileRankRow` (rank + XP bar) only renders inside `ProfileHero`, which is mobile-only. Desktop users see no gamification stats.

---

## Fix Plan

### 1. Sync lesson XP to `profiles.total_xp` (LessonScreen.tsx)
After `updateStreakViaRPC` succeeds, call `awardXP(user.id, "complete_lesson", xpCalc.totalXP)` — or more efficiently, add a direct profile update inline to avoid double-logging. Since `updateStreakViaRPC` already logs to the streaks table, the cleanest fix is to add a profile increment after the RPC call:

```typescript
// After streak update, sync XP to profile
await supabase.from("profiles")
  .update({ total_xp: streakResult.totalXp })
  .eq("id", user.id);
```

Wait — that uses the streaks total, not incremental. Better: just increment profiles.total_xp by `xpCalc.totalXP` directly, matching how `awardXP` works but without double-inserting into `user_xp_logs`.

### 2. Refresh profile after lesson completion (LessonScreen.tsx)
Call `refreshProfile()` from `useAuth()` at the end of `handleLessonDone`.

### 3. Add rank display to desktop profile (ProfilePage.tsx)
Extract `ProfileRankRow` into its own shared component and render it on the desktop left column below the avatar.

---

## Files Modified

| File | Change |
|------|--------|
| `src/features/learning/components/lesson/LessonScreen.tsx` | Add `profiles.total_xp` increment + call `refreshProfile()` after completion |
| `src/features/profile/components/ProfileHero.tsx` | Extract `ProfileRankRow` to its own file |
| `src/features/profile/components/ProfileRankRow.tsx` | **Create** — shared rank display component |
| `src/features/profile/ProfilePage.tsx` | Render `ProfileRankRow` in desktop left column |
| `src/features/profile/components/index.ts` | Export `ProfileRankRow` |

No database changes needed.

