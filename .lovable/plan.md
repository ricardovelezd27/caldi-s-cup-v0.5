

# Phase 4: Gamification System

## Summary

Add the gamification layer on top of the existing learning infrastructure. This phase creates new UI components for streaks, XP breakdowns, daily goals, leagues, achievements, and hearts, plus the services and hooks to drive them. One database migration adds the `update_streak_and_xp` RPC function and a `hearts` column set to `learning_user_streaks`. One new route (`/achievements`) and an update to the existing `/leaderboard` page are included.

---

## Architecture Decisions

**Hearts on existing table.** Rather than creating a separate `learning_user_hearts` table, hearts columns are added to `learning_user_streaks` (which already holds per-user gamification state). This avoids an extra join on every lesson load and keeps the user's gamification row as a single source of truth.

**No gems/premium system yet.** The prompt references gems and premium purchases. These require a payment integration that is out of scope. The UI will render the options but the "buy" paths will show a "coming soon" state. Hearts refill over time (1 per 4 hours) and through practice lessons.

**Server-side streak logic.** A Postgres function `update_streak_and_xp` handles atomic streak increments to avoid race conditions. The existing client-side `streakService.ts` `updateStreak()` will be replaced by an RPC call to this function.

**XP calculation stays client-side.** XP bonuses (perfect lesson, speed, streak) are calculated in the browser and the total is passed to the RPC. This keeps the DB function simple while the bonus logic lives in a testable pure function (`xpService.ts`).

**Achievement checking is client-side.** After each lesson completion, the hook compares the user's updated stats against the achievement definitions and inserts any newly earned achievements. This avoids a DB trigger that would need to query multiple tables.

---

## Database Migration

A single migration that:

1. Adds columns to `learning_user_streaks`:
   - `hearts INTEGER NOT NULL DEFAULT 5`
   - `max_hearts INTEGER NOT NULL DEFAULT 5`
   - `hearts_last_refilled_at TIMESTAMPTZ DEFAULT now()`

2. Creates the `update_streak_and_xp` RPC function (plpgsql, SECURITY DEFINER) that atomically:
   - Creates a streak row if none exists
   - Increments streak if last activity was yesterday
   - Resets streak if gap is larger (no freeze logic in v1 -- freeze is a future enhancement)
   - Adds XP and increments `total_lessons_completed`
   - Updates `last_activity_date` to today

3. Adds RLS policy for the new columns (already covered by existing row-level policies on `learning_user_streaks` since columns inherit table policies).

---

## Files Created (New)

| # | Path | Purpose |
|---|---|---|
| 1 | `src/features/learning/services/xpService.ts` | Pure function: `calculateLessonXP()` returning base + bonuses + total |
| 2 | `src/features/learning/services/leagueService.ts` | Queries `learning_user_league` + `learning_leagues`, fetches leaderboard, adds weekly XP |
| 3 | `src/features/learning/services/achievementService.ts` | Fetches achievements, checks conditions against user stats, inserts earned ones |
| 4 | `src/features/learning/hooks/useDailyGoal.ts` | TanStack Query wrapper around daily goal; provides `setGoal()`, `addXP()`, computed progress |
| 5 | `src/features/learning/hooks/useLeague.ts` | Fetches user's current league, rank, leaderboard entries, days remaining in week |
| 6 | `src/features/learning/hooks/useAchievements.ts` | Fetches all achievements + user's earned ones; provides `checkAndUnlock()` |
| 7 | `src/features/learning/hooks/useHearts.ts` | Reads hearts from streak row; provides `loseHeart()`, `gainHeart()`, time-until-refill |
| 8 | `src/features/learning/data/dailyGoals.ts` | Static data: 4 goal tiers (Casual 10XP, Regular 20XP, Serious 30XP, Intense 50XP) |
| 9 | `src/features/learning/components/gamification/StreakCalendar.tsx` | Weekly Mon-Sun view with check/today/future markers |
| 10 | `src/features/learning/components/gamification/StreakMilestone.tsx` | Celebration overlay for 7/30/100/365 day milestones |
| 11 | `src/features/learning/components/gamification/XPGainAnimation.tsx` | Floating "+N XP" animation with optional multiplier badge |
| 12 | `src/features/learning/components/gamification/DailyGoalSelector.tsx` | 4-tier goal picker (Casual/Regular/Serious/Intense) with save |
| 13 | `src/features/learning/components/gamification/DailyGoalComplete.tsx` | Goal-achieved celebration with mascot |
| 14 | `src/features/learning/components/gamification/LeagueCard.tsx` | Current league + rank preview card for LearnPage |
| 15 | `src/features/learning/components/gamification/LeagueLeaderboard.tsx` | Full scrollable leaderboard with promotion/demotion zones |
| 16 | `src/features/learning/components/gamification/AchievementBadge.tsx` | Single badge (earned or locked state) |
| 17 | `src/features/learning/components/gamification/AchievementGrid.tsx` | Grid of all badges grouped by category |
| 18 | `src/features/learning/components/gamification/AchievementUnlock.tsx` | Modal celebration for newly earned achievement |
| 19 | `src/features/learning/components/gamification/HeartsDisplay.tsx` | Heart icons row for lesson header |
| 20 | `src/features/learning/components/gamification/HeartsEmptyModal.tsx` | "Out of hearts" dialog with practice/wait/refill options |
| 21 | `src/features/learning/pages/AchievementsPage.tsx` | Full achievements page with AchievementGrid |

## Files Modified (Existing)

| # | Path | Change |
|---|---|---|
| 1 | `src/features/learning/types/learning.ts` | Add `LearningUserHearts` fields to `LearningUserStreak` interface (hearts, maxHearts, heartsLastRefilledAt) |
| 2 | `src/features/learning/services/streakService.ts` | Replace `updateStreak()` with RPC call to `update_streak_and_xp`; add `loseHeart()`, `gainHeart()`, `getHeartsRefillTime()` |
| 3 | `src/features/learning/hooks/useStreak.ts` | Enhance return with `isStreakAtRisk`, `nextMilestone` computed values; add hearts data |
| 4 | `src/features/learning/hooks/useXP.ts` | Keep animation hook as-is (already works); no changes needed |
| 5 | `src/features/learning/components/gamification/StreakDisplay.tsx` | Add `onClick` prop, `showLabel` prop, size variants |
| 6 | `src/features/learning/components/gamification/XPCounter.tsx` | Add size variants and total XP display mode |
| 7 | `src/features/learning/components/gamification/DailyGoalRing.tsx` | Add celebrate animation when goal achieved, size variants |
| 8 | `src/features/learning/components/lesson/LessonScreen.tsx` | Wire gamification on lesson complete: call RPC, update daily goal, check achievements, show XP breakdown |
| 9 | `src/features/learning/components/lesson/LessonComplete.tsx` | Add XP breakdown display (base + bonuses), achievement unlock toast, daily goal progress |
| 10 | `src/features/learning/components/lesson/LessonProgress.tsx` | Add HeartsDisplay to the progress header bar |
| 11 | `src/features/learning/pages/LearnPage.tsx` | Add LeagueCard to gamification bar; show streak milestone if applicable |
| 12 | `src/features/learning/pages/LeaderboardPage.tsx` | Replace placeholder with full LeagueLeaderboard component |
| 13 | `src/features/learning/services/index.ts` | Re-export xpService, leagueService, achievementService |
| 14 | `src/App.tsx` | Add `/achievements` route (protected) |
| 15 | `src/constants/app.ts` | Add `achievements: "/achievements"` to ROUTES |
| 16 | `src/i18n/en.ts` | Add `gamification.*` key block (~60 keys for streaks, XP, goals, leagues, achievements, hearts) |
| 17 | `src/i18n/es.ts` | Add `gamification.*` key block (Spanish translations) |

---

## Component Specifications

### Streaks

**StreakCalendar**: Renders Mon-Sun row for the current week. Each day is a circle: green check (completed), pulsing teal outline (today, not done), gray outline (future). Data comes from `useStreak()` which provides `lastActivityDate` and `totalDaysActive`. Days are calculated client-side by walking back from today.

**StreakMilestone**: A dialog/overlay shown when `currentStreak` hits 7, 30, 100, or 365. Shows large fire emoji, milestone number, Caldi celebrating mascot, XP bonus badge, and "Keep it up!" CTA. Triggered from `LessonScreen` after streak update.

### XP

**XPGainAnimation**: Absolutely positioned floating element. Uses CSS `@keyframes float-up` (opacity 1 -> 0, translateY 0 -> -60px) over 1.5s. Shows "+{amount} XP" in Bangers font. If multiplier > 1, adds a secondary line "{multiplier}X BOOST!".

**`xpService.ts` calculateLessonXP()**: Pure function. Inputs: lessonXpReward, correctCount, totalCount, timeSpentSeconds, currentStreak, isFirstLessonToday. Returns `{ baseXP, bonuses: { perfect, speed, streak, firstOfDay }, totalXP }`. Bonuses: perfect (+5 if 100%), speed (+3 if < 120s), streak (+2 per 10 streak days), firstOfDay (+5).

### Daily Goals

**DailyGoalSelector**: Card with 4 options (Casual 10XP, Regular 20XP, Serious 30XP, Intense 50XP). Each is an ExerciseOption-like button. Save updates `learning_user_daily_goals.goal_xp` for today. Accessible from LearnPage via a settings icon next to the DailyGoalRing.

**DailyGoalComplete**: Celebration overlay similar to StreakMilestone. Shown when `earnedXp >= goalXp`. Caldi celebrating + "Goal Achieved!" + confetti emojis.

### Leagues

**LeagueCard**: Compact card showing league icon + name, user rank (#N), weekly XP bar, and "N days left" countdown. Clicking navigates to `/leaderboard`.

**LeagueLeaderboard**: Full page component. Fetches all users in the same league group for the current week, sorted by `weekly_xp` DESC. Renders three zones with visual separators: Promotion (green top N), Safe (neutral), Demotion (red bottom N). Current user row is highlighted with teal border. Uses `useLeague()` hook.

**`leagueService.ts`**: `getUserLeague(userId)` fetches from `learning_user_league` joined with `learning_leagues`. `getLeaderboard(leagueId, weekStart)` fetches all users in same league for that week, ordered by `weekly_xp`. `addWeeklyXP(userId, xp)` increments `weekly_xp`.

### Achievements

**AchievementBadge**: Shows icon (large emoji), name, description, and either earned date or XP reward preview (if locked). Locked badges have a gray overlay with lock icon.

**AchievementGrid**: Two sections: "Earned" (chronologically) and "Locked" (by sort_order). Responsive grid (4 cols desktop, 2 cols mobile). Uses `useAchievements()`.

**AchievementUnlock**: Dialog with badge icon scaling up, "Achievement Unlocked!" heading, name, description, XP reward counter animation, and "Awesome!" dismiss button. Plays `sounds.playCelebration()`.

**`achievementService.ts`**: `getAchievements()` fetches all active from `learning_achievements`. `getUserAchievements(userId)` fetches from `learning_user_achievements`. `checkAndUnlock(userId, stats)` compares stats against definitions and inserts any newly earned, returning the list of newly unlocked.

### Hearts

**HeartsDisplay**: Renders `hearts` filled heart emojis and `maxHearts - hearts` empty hearts. If hearts <= 2, pulses red. Clicking opens HeartsEmptyModal (if 0) or shows current count.

**HeartsEmptyModal**: Dialog with three options: "Practice to earn hearts" (navigates to review lesson -- future feature, shows "coming soon"), "Wait for refill" (shows countdown timer), "Go Premium" (shows "coming soon"). Hearts refill 1 every 4 hours, calculated client-side from `hearts_last_refilled_at`.

**Heart loss integration**: In `LessonScreen`, when an exercise answer is incorrect, call `loseHeart()`. If hearts reach 0, show `HeartsEmptyModal` and prevent further exercises until refill.

---

## Lesson Completion Flow (Updated)

The `LessonScreen` completion handler will be enhanced:

1. Calculate XP via `calculateLessonXP()`
2. Call `update_streak_and_xp` RPC (atomic streak + XP update)
3. Call `addXPToDaily()` (update daily goal progress)
4. Call `addWeeklyXP()` (update league weekly XP)
5. Call `upsertLessonProgress()` (save lesson result)
6. Call `checkAndUnlock()` (check achievements)
7. Show `LessonComplete` with XP breakdown, any new achievements, daily goal status

For anonymous users, steps 2-6 are skipped (only localStorage update via `useAnonymousProgress`).

---

## Implementation Order

1. **Database migration**: Add hearts columns + `update_streak_and_xp` RPC
2. **Types + data files**: Update `learning.ts` types, create `dailyGoals.ts`
3. **Services**: `xpService.ts`, `leagueService.ts`, `achievementService.ts`, update `streakService.ts`
4. **Hooks**: `useDailyGoal`, `useLeague`, `useAchievements`, `useHearts`, update `useStreak`
5. **Gamification components**: All 11 new components
6. **Integration**: Update `LessonScreen`, `LessonComplete`, `LessonProgress`, `LearnPage`, `LeaderboardPage`
7. **Routes + i18n**: Add `/achievements` route, add all gamification translation keys

---

## Technical Notes

- The `update_streak_and_xp` function uses `SECURITY DEFINER` with `search_path = 'public'` to safely update the streak row. It accepts `p_user_id`, `p_date`, and `p_xp_earned` parameters.
- Heart refill timing is computed client-side: `Math.max(0, 4*3600 - (now - hearts_last_refilled_at_seconds))`. The actual refill happens when the user opens the app and the hook detects elapsed time.
- League weekly reset (promotion/demotion) is deferred to a future phase as it requires a scheduled edge function. The leaderboard UI will show current standings but promotion/demotion animations won't trigger automatically yet.
- All new components follow the sticker aesthetic (4px border, floating shadow) and use `useLanguage()` for bilingual text.
- Achievement definitions are seeded into the `learning_achievements` table via the migration (the table already exists with the right schema). The prompt's achievement data will be inserted.

