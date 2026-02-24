

# Pre-Phase 5 Gap Analysis: What's Missing from Phases 1-4

After reviewing the full codebase against the plan, here is a detailed accounting of what has been built, what is incomplete, and what needs to be finished before moving to Phase 5 (Content Population).

---

## Status Summary

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1: Database Schema | COMPLETE | All 13 tables, RLS, triggers, seeds in place |
| Phase 2: Component Architecture | COMPLETE | Pages, tracks, lessons, mascots all wired |
| Phase 3: Exercise Templates | COMPLETE | 12 exercise types + base components + tests |
| Phase 4: Gamification | PARTIALLY COMPLETE | Core services/hooks/components exist, but integration is missing |

---

## Phase 4 Gaps (Must Fix Before Phase 5)

### Gap 1: LessonScreen does NOT call gamification services on completion

**Current state:** `LessonScreen.tsx` (line 100) passes a hardcoded `xpEarned={10}` to `LessonComplete`. It does not call `updateStreakViaRPC`, `addXPToDaily`, `addWeeklyXP`, `upsertLessonProgress`, or `checkAndUnlock` on lesson completion.

**What's needed:**
- Wire `useHearts` into `LessonScreen` to deduct a heart on wrong answers and show `HeartsEmptyModal` when hearts reach 0
- On lesson complete (for authenticated users): call `calculateLessonXP()`, then `updateStreakViaRPC()`, `addXPToDaily()`, `addWeeklyXP()`, `upsertLessonProgress()`, and `checkAndUnlock()`
- Pass real XP breakdown data to `LessonComplete`

### Gap 2: LessonComplete shows no XP breakdown or achievement unlocks

**Current state:** Shows a basic score/time summary with a hardcoded XP value.

**What's needed:**
- Accept and display XP breakdown (base + bonuses: perfect, speed, streak, firstOfDay)
- Show daily goal progress bar
- Show any newly unlocked achievements via `AchievementUnlock` modal
- Trigger `XPGainAnimation`

### Gap 3: LessonProgress header has no HeartsDisplay

**Current state:** Shows only a progress bar and exit button.

**What's needed:**
- Add `HeartsDisplay` component to the right side of the progress header

### Gap 4: Missing `gamification.*` i18n keys

**Current state:** The `en.ts` and `es.ts` files have NO `gamification` key block. The gamification components exist but have hardcoded English strings or use non-existent translation keys.

**What's needed:**
- Add ~60 `gamification.*` keys to both `en.ts` and `es.ts` covering streaks, XP, goals, leagues, achievements, and hearts

### Gap 5: `useLesson` hook has no `lesson` data

**Current state:** Line 39 of `useLesson.ts` says `const lesson: LearningLesson | null = null;` -- the hook never fetches the lesson metadata (needed for `xp_reward`).

**What's needed:**
- Add a query to fetch the lesson row by ID (or add a `getLessonById` function to `learningService.ts`)
- This is required so `calculateLessonXP` can use `lesson.xpReward` as the base

### Gap 6: Exercise history not recorded during lessons

**Current state:** `useLesson.submitAnswer` tracks score locally but never calls `recordExerciseHistory()` from `progressService.ts`.

**What's needed:**
- Record each exercise attempt (exercise ID, is_correct, time_spent, user_answer) for authenticated users
- This data is also needed for the future spaced repetition system (Phase 6)

---

## Items That Are Correctly Deferred (NOT gaps)

These are explicitly noted as "future phase" in the approved plan and are NOT blockers:

- **League weekly reset edge function** -- Requires a scheduled backend function; deferred to post-MVP
- **Streak freeze logic** -- The `streak_freezes_available` column exists but freeze usage is not wired; noted as future enhancement
- **Gems/premium system** -- UI shows "coming soon" states; requires payment integration
- **Spaced repetition** -- Phase 6 per the plan

---

## Recommended Fix Plan (6 tasks)

### Task 1: Add `getLessonById` to learningService
Add a function to fetch a single lesson row by UUID. Update `useLesson` to call it and populate the `lesson` field.

### Task 2: Wire gamification into LessonScreen
On lesson completion (authenticated users):
1. Calculate XP via `calculateLessonXP(lesson.xpReward, correct, total, timeSpent, streak, isFirstToday)`
2. Call `updateStreakViaRPC(userId, totalXP)`
3. Call `addXPToDaily(userId, totalXP)`
4. Call `addWeeklyXP(userId, totalXP)`
5. Call `upsertLessonProgress(...)` with real data
6. Call `checkAndUnlock(userId, updatedStats)`
7. Pass results to `LessonComplete`

On wrong answer: call `loseHeart()`, show `HeartsEmptyModal` if hearts reach 0.

### Task 3: Enhance LessonComplete with XP breakdown
- Accept `xpBreakdown` prop with base + bonus detail
- Show animated XP gain
- Show daily goal progress
- Show achievement unlock modal for any newly earned badges

### Task 4: Add HeartsDisplay to LessonProgress
- Import and render `HeartsDisplay` in the lesson header bar

### Task 5: Record exercise history
- In `useLesson.submitAnswer`, call `recordExerciseHistory()` for authenticated users with exercise ID, correctness, time, and answer data

### Task 6: Add gamification i18n keys
- Add the full `gamification.*` block (~60 keys) to both `en.ts` and `es.ts`

---

## Technical Notes

- All gamification components (`StreakCalendar`, `DailyGoalSelector`, `LeagueLeaderboard`, `AchievementGrid`, etc.) are already built and exported. The gap is purely in **wiring them into the lesson flow** and **providing translation keys**.
- The `update_streak_and_xp` RPC function is deployed and tested in the database.
- The `useHearts`, `useDailyGoal`, `useLeague`, and `useAchievements` hooks are implemented and ready to use.
- After these 6 tasks, the gamification system will be fully functional end-to-end and Phase 5 (Content Population) can proceed with confidence that lesson completions will correctly update all gamification state.

