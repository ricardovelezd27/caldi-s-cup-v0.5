

## Gamification Audit: Streak + Daily Goal Fixes

### Issues Found

**1. Broken `updateStreakOnAction` logic (Critical)**
In `src/services/gamification/streakService.ts`, the `updateStreakOnAction` function blindly increments `profiles.current_streak` by 1 on the first action of each day — without checking whether the user was active yesterday. This means:
- A user who skips 5 days and returns gets their streak incremented instead of reset to 1
- `profiles.current_streak` drifts out of sync with the correct value in `learning_user_streaks.current_streak` (which is properly managed by the `update_streak_and_xp` RPC)

**2. `profiles.current_streak` never synced after lesson completion**
`LessonScreen.tsx` calls `updateStreakViaRPC` which correctly updates `learning_user_streaks`, but never writes the resulting `currentStreak` back to `profiles.current_streak`. The `refreshProfile()` call at the end reads stale data.

**3. ProfileStreakCard inconsistency**
`ProfileStreakCard` falls back from `streak?.currentStreak` (learning_user_streaks) to `profile?.current_streak` (profiles table). Since these two values diverge, users may see incorrect streaks depending on which loads first.

**4. Daily Goals — No issues found**
The daily goal pipeline (create/upsert/read) is correctly implemented across `streakService.ts`, `useDailyGoal.ts`, `LearningHubWidget`, `ProfileDailyGoalCard`, and `LearnPage`. The `addXPToDaily` function correctly auto-creates a goal row using the user's last threshold, and all UI components render from the same query key.

---

### Plan

**File 1: `src/services/gamification/streakService.ts`**
- Rewrite `updateStreakOnAction` to:
  1. Read `learning_user_streaks.last_activity_date` and `current_streak`
  2. Apply the same yesterday/reset/same-day logic as the RPC
  3. Update both `learning_user_streaks` (last_activity_date, current_streak) and `profiles.current_streak` in sync
  4. If no `learning_user_streaks` row exists, create one (upsert pattern)
- This ensures non-lesson actions (scan, brew, rate) correctly maintain the streak

**File 2: `src/features/learning/components/lesson/LessonScreen.tsx`**
- After `updateStreakViaRPC` succeeds, sync `profiles.current_streak` with the returned `streakResult.currentStreak` value
- This is a single additional `supabase.from("profiles").update(...)` call right after the RPC

**File 3: `src/features/profile/components/ProfileStreakCard.tsx`**
- Remove the `profile?.current_streak` fallback — use only the `streak?.currentStreak` value from the `useStreak` hook (which reads `learning_user_streaks`, the source of truth)
- Show 0 while loading rather than a potentially stale profile value

These changes keep all existing functionality intact while fixing the data consistency issues.

