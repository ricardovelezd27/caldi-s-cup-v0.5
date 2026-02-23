

# Phase 2: Core Learning Components

## Summary

Build the full UI layer for the Caldi Learning Module on top of the Phase 1 database foundation. This includes 3 new pages, ~25 new components, 7 hooks, 2 new services, mascot assets, mascot dialogue data, navigation updates, and i18n additions for both EN and ES.

## Scope and Sequencing

This is a large phase. To manage complexity and avoid overwhelming a single implementation pass, the work is broken into 5 sequential implementation batches.

---

## Batch 1: Assets, Data, Constants, i18n, and Navigation

### 1.1 Copy Mascot Assets

Copy all 10 uploaded mascot images into `src/assets/characters/`:

| Source file | Target path |
|---|---|
| Caldi_Celebrating.png | src/assets/characters/caldi-celebrating.png |
| Caldi_Curious_Pose.png | src/assets/characters/caldi-curious.png |
| Caldi_Encouraging_Pose.png | src/assets/characters/caldi-encouraging.png |
| Caldi_Neutral_Pose.png | src/assets/characters/caldi-neutral.png |
| Caldi_Thinking_Pose.png | src/assets/characters/caldi-thinking.png |
| Confused_Goat_Frontal.png | src/assets/characters/goat-confused.png |
| Crazy_Goat_Frontal.png | src/assets/characters/goat-crazy.png |
| Excited_Goat_Frontal.png | src/assets/characters/goat-excited.png |
| Happy_Goat_Frontal.png | src/assets/characters/goat-happy.png |
| Neutral_Goat_Frontal.png | src/assets/characters/goat-neutral.png |

### 1.2 Create Mascot Dialogues Data

Create `src/features/learning/data/mascotDialogues.ts` with the full dialogue corpus provided in the prompt (caldi and goat lines for greeting, correct, incorrect, encouragement, streak, lessonComplete categories) plus the `getRandomDialogue()` helper with template replacement.

### 1.3 Update Constants

Add to `src/constants/app.ts` ROUTES:
- `learn: "/learn"`
- `leaderboard: "/leaderboard"`

### 1.4 i18n Updates

Add the full `learn.*` key block and `nav.learn` to both `src/i18n/en.ts` and `src/i18n/es.ts` as specified in the prompt.

### 1.5 Navigation Updates

**Header.tsx** -- Add a "Learn" nav link (with `GraduationCap` icon) to both desktop and mobile navigation. Position it after "Label Scanner" and before "Our Story". Available to both authenticated and anonymous users.

### 1.6 Routes

**App.tsx** -- Add 3 new routes:
- `/learn` -> `LearnPage`
- `/learn/:trackId` -> `TrackPage`
- `/learn/:trackId/:lessonId` -> `LessonPage`
- `/leaderboard` -> `LeaderboardPage` (protected, requires auth)

---

## Batch 2: Services, Hooks, and Mascot Components

### 2.1 Progress Service

Create `src/features/learning/services/progressService.ts`:
- `getUserProgress(userId)` -- fetch all `learning_user_progress` rows for user
- `getLessonProgress(userId, lessonId)` -- fetch single lesson progress
- `upsertLessonProgress(progress)` -- insert or update lesson progress
- `recordExerciseHistory(history)` -- insert into `learning_user_exercise_history`

### 2.2 Streak Service

Create `src/features/learning/services/streakService.ts`:
- `getUserStreak(userId)` -- fetch from `learning_user_streaks`
- `initializeStreak(userId)` -- create initial streak row
- `updateStreak(userId)` -- check last_activity_date, increment/reset streak, update total_xp
- `getDailyGoal(userId, date)` -- fetch or create daily goal row
- `addXPToDaily(userId, xp)` -- update earned_xp on today's goal

### 2.3 Hooks

| Hook | File | Purpose |
|---|---|---|
| `useLearningTracks` | hooks/useLearningTracks.ts | TanStack Query wrapper around `getTracks()`, enriched with user progress % per track |
| `useTrackPath` | hooks/useTrackPath.ts | Given a track UUID, fetches sections -> units -> lessons in a nested structure. Determines lock state based on user progress and `requires_section_id` |
| `useLesson` | hooks/useLesson.ts | State machine managing lesson flow (loading -> intro -> exercise -> feedback -> complete -> signup). Tracks current exercise index, score, time |
| `useExerciseSubmit` | hooks/useExerciseSubmit.ts | Handles answer submission: validates correctness, records to exercise history, returns feedback |
| `useStreak` | hooks/useStreak.ts | TanStack Query wrapper around streak service. Provides current streak, daily goal progress |
| `useXP` | hooks/useXP.ts | Manages XP animation state. Receives XP earned, provides animated counter value |
| `useAnonymousProgress` | hooks/useAnonymousProgress.ts | localStorage-based progress for unauthenticated users. Stores lesson IDs completed, XP, streak. Migrates to DB on auth. Limits to 3 lessons before forcing signup |

### 2.4 Mascot Components

**MascotCharacter.tsx** (`components/mascot/`):
- Props: `mascot ('caldi' | 'goat')`, `mood`, `size ('sm' | 'md' | 'lg')`
- Maps mood to correct asset image via an internal lookup object
- Renders with subtle bounce-in animation via CSS keyframes
- Caldi moods: neutral, encouraging, celebrating, thinking, curious (5 assets)
- Goat moods: neutral, happy, excited, confused, crazy (5 assets). Map "encouraging" -> "happy", "celebrating" -> "excited", "thinking" -> "confused"

**MascotDialogue.tsx**:
- Props: `text`, `position ('left' | 'right')`
- Speech bubble with typewriter animation (reveals text character by character)
- Styled as a card with the sticker aesthetic (4px border, floating shadow)

**MascotReaction.tsx**:
- Combines MascotCharacter + MascotDialogue
- Props: `mascot`, `mood`, `dialogue`, `size`
- Handles the pairing of character image + speech bubble

---

## Batch 3: Track Components and LearnPage

### 3.1 TrackProgress

`components/track/TrackProgress.tsx`:
- Circular SVG progress indicator
- Props: `percent (0-100)`, `colorHex`, `size`
- Shows percentage number in center
- If 0%, shows "Start" text instead

### 3.2 TrackCard

`components/track/TrackCard.tsx`:
- Props: `track: LearningTrack`, `progressPercent: number`, `isRecommended: boolean`
- Large emoji icon from track data
- Track name (bilingual via `useLanguage`)
- Truncated description
- TrackProgress circle or "Start" button
- Color accent border-left using track's `color_hex`
- Sticker aesthetic: 4px border, floating shadow
- If `is_bonus`, show subtle "Bonus" badge in corner
- If `isRecommended`, show highlighted border (teal)
- Links to `/learn/:trackId`

### 3.3 TrackGrid

`components/track/TrackGrid.tsx`:
- Renders 4 TrackCards in a responsive grid (2x2 desktop, 1-column mobile)
- Props: `tracks`, `progressMap`, `recommendedTrackId`

### 3.4 LearnPage

`pages/LearnPage.tsx` (route: `/learn`):
- PageLayout with Header
- Heading: "Learn Coffee" (i18n `learn.title`) with Bangers font
- Subtitle (i18n `learn.subtitle`)
- If logged in: StreakDisplay + DailyGoalRing in a top bar
- TrackGrid showing all 4 tracks
- If logged in with coffee_tribe: highlight the recommended track (fox -> history_culture, owl -> brewing_science, hummingbird -> bean_knowledge, bee -> sustainability)
- If anonymous: subtle banner at bottom "Sign up to save your progress"
- Uses `useLearningTracks()` hook

---

## Batch 4: TrackPage and Path Visualization

### 4.1 TrackPathView

`components/track/TrackPathView.tsx`:
- Vertical timeline/path layout
- Receives nested data: sections containing units containing lessons
- Each section has a header with level badge (Beginner, Foundation, etc.) and learning goal
- Each unit is a card containing lesson dots (circles)
- Lesson dots: filled green = complete, outlined = available, gray with lock icon = locked
- Vertical connecting lines between units (CSS borders)
- Current position (first available lesson) gets a pulsing highlight
- Locked sections are grayed out with a lock icon overlay
- Click on an available lesson dot navigates to `/learn/:trackId/:lessonId`

### 4.2 TrackPage

`pages/TrackPage.tsx` (route: `/learn/:trackId`):
- Back button to `/learn`
- Track header: icon, name, overall progress bar
- TrackPathView with data from `useTrackPath(trackId)`
- If track has no sections/units/lessons yet (empty content), show "Coming soon" with Caldi mascot in curious mood

---

## Batch 5: Lesson Flow, Exercise Base, and Gamification

### 5.1 LessonProgress

`components/lesson/LessonProgress.tsx`:
- Linear progress bar showing "Exercise X of Y"
- Uses the Progress UI component
- Includes a close/exit button (top-right) to abandon lesson

### 5.2 LessonIntro

`components/lesson/LessonIntro.tsx`:
- Lesson name, intro text (bilingual)
- Mascot greeting (random from `getRandomDialogue`)
- Estimated time badge
- XP reward badge
- "Start" button

### 5.3 ExerciseWrapper

`components/exercises/base/ExerciseWrapper.tsx`:
- Common wrapper for all exercise types
- Timer display (counting up)
- Submit/Check button at bottom
- Manages disabled state while feedback is shown

### 5.4 ExerciseFeedback

`components/exercises/base/ExerciseFeedback.tsx`:
- Correct: green overlay with mascot celebrating + random correct dialogue
- Incorrect: orange overlay with mascot thinking + random incorrect dialogue + explanation text from `question_data`
- "Continue" button to proceed

### 5.5 ExerciseRenderer

`components/lesson/ExerciseRenderer.tsx`:
- Switch on `exercise.exerciseType`
- For Phase 2: ALL types render a placeholder component showing exercise type name, the question text from `question_data.question` (if present), and a "Coming in Phase 3" message
- Props: `exercise`, `onAnswer`, `disabled`

### 5.6 LessonComplete

`components/lesson/LessonComplete.tsx`:
- Celebration screen with Caldi celebrating
- Animated XP counter (using useXP hook)
- Score display (X/Y correct, percentage)
- Time spent
- "Next Lesson" button (if available) or "Back to Track"
- Confetti-like visual effect (CSS keyframe animation with emojis)

### 5.7 LessonScreen

`components/lesson/LessonScreen.tsx`:
- Main lesson container driven by `useLesson()` state machine
- Renders the correct sub-component based on state:
  - `loading` -> skeleton/spinner
  - `intro` -> LessonIntro
  - `exercise` -> LessonProgress + ExerciseRenderer + ExerciseWrapper
  - `feedback` -> ExerciseFeedback overlay
  - `complete` -> LessonComplete
  - `signup` -> SignupPrompt (for anonymous users after first lesson)

### 5.8 LessonPage

`pages/LessonPage.tsx` (route: `/learn/:trackId/:lessonId`):
- Full-screen lesson experience (no header/footer for immersion)
- Exit button in top-left to go back to track
- Renders LessonScreen
- On complete: saves progress via progressService (or localStorage for anonymous)
- Updates streak via streakService

### 5.9 Gamification Components

**StreakDisplay.tsx** (`components/gamification/`):
- Shows fire emoji + streak count
- Props: `currentStreak`, `size`
- Subtle animation on mount

**XPCounter.tsx**:
- Animated number counter that rolls up from 0 to earned XP
- Uses requestAnimationFrame for smooth animation

**DailyGoalRing.tsx**:
- Circular progress ring showing earned_xp / goal_xp
- Changes color when goal is achieved (teal -> gold)
- Shows "Daily Goal" label

**SignupPrompt.tsx**:
- Dialog/modal shown after anonymous user completes first lesson
- Caldi celebrating mascot
- Benefits list (save progress, streaks, leaderboards, achievements)
- "Sign Up Free" button -> navigates to `/auth`
- "Maybe Later" link -> dismisses, sets `hasSeenSignupPrompt` in localStorage
- After signup, `useAnonymousProgress` migrates localStorage data to DB

---

## Technical Notes

- All components follow existing patterns: `useLanguage()` for bilingual text, `cn()` for className merging, CaldiCard or raw divs with sticker aesthetic classes
- The `useLesson` hook is the most complex piece -- it manages a finite state machine. States transition: loading -> intro -> exercise (loops) -> feedback (loops) -> complete -> optionally signup
- Anonymous progress is capped at 3 lessons via `useAnonymousProgress`. After 3, the SignupPrompt becomes mandatory (no "Maybe Later")
- RLS policies already permit authenticated SELECT on active content tables, so the anonymous-first approach requires that content tables allow unauthenticated reads. The current RLS uses `is_active = true` without `auth.uid()` checks on SELECT, which means anon key access should work for content browsing. No migration needed.
- Mascot mood mapping: exercise's `mascot_mood` DB field maps directly to the character pose. If a mood doesn't have a dedicated asset, fallback to "neutral"
- The LeaderboardPage is listed in routes but will be a simple placeholder page in this phase ("Coming Soon" with league tier data from `getLeagues()`)

## Files Created (New)

| # | Path |
|---|---|
| 1 | src/assets/characters/caldi-celebrating.png |
| 2 | src/assets/characters/caldi-curious.png |
| 3 | src/assets/characters/caldi-encouraging.png |
| 4 | src/assets/characters/caldi-neutral.png |
| 5 | src/assets/characters/caldi-thinking.png |
| 6 | src/assets/characters/goat-confused.png |
| 7 | src/assets/characters/goat-crazy.png |
| 8 | src/assets/characters/goat-excited.png |
| 9 | src/assets/characters/goat-happy.png |
| 10 | src/assets/characters/goat-neutral.png |
| 11 | src/features/learning/data/mascotDialogues.ts |
| 12 | src/features/learning/services/progressService.ts |
| 13 | src/features/learning/services/streakService.ts |
| 14 | src/features/learning/hooks/useLearningTracks.ts |
| 15 | src/features/learning/hooks/useTrackPath.ts |
| 16 | src/features/learning/hooks/useLesson.ts |
| 17 | src/features/learning/hooks/useExerciseSubmit.ts |
| 18 | src/features/learning/hooks/useStreak.ts |
| 19 | src/features/learning/hooks/useXP.ts |
| 20 | src/features/learning/hooks/useAnonymousProgress.ts |
| 21 | src/features/learning/components/mascot/MascotCharacter.tsx |
| 22 | src/features/learning/components/mascot/MascotDialogue.tsx |
| 23 | src/features/learning/components/mascot/MascotReaction.tsx |
| 24 | src/features/learning/components/track/TrackCard.tsx |
| 25 | src/features/learning/components/track/TrackGrid.tsx |
| 26 | src/features/learning/components/track/TrackProgress.tsx |
| 27 | src/features/learning/components/track/TrackPathView.tsx |
| 28 | src/features/learning/components/lesson/LessonScreen.tsx |
| 29 | src/features/learning/components/lesson/LessonIntro.tsx |
| 30 | src/features/learning/components/lesson/LessonProgress.tsx |
| 31 | src/features/learning/components/lesson/LessonComplete.tsx |
| 32 | src/features/learning/components/lesson/ExerciseRenderer.tsx |
| 33 | src/features/learning/components/exercises/base/ExerciseWrapper.tsx |
| 34 | src/features/learning/components/exercises/base/ExerciseFeedback.tsx |
| 35 | src/features/learning/components/gamification/StreakDisplay.tsx |
| 36 | src/features/learning/components/gamification/XPCounter.tsx |
| 37 | src/features/learning/components/gamification/DailyGoalRing.tsx |
| 38 | src/features/learning/components/gamification/SignupPrompt.tsx |
| 39 | src/features/learning/pages/LearnPage.tsx |
| 40 | src/features/learning/pages/TrackPage.tsx |
| 41 | src/features/learning/pages/LessonPage.tsx |
| 42 | src/features/learning/pages/LeaderboardPage.tsx |

## Files Modified (Existing)

| # | Path | Change |
|---|---|---|
| 1 | src/constants/app.ts | Add `learn` and `leaderboard` routes |
| 2 | src/i18n/en.ts | Add `learn.*` block and `nav.learn` |
| 3 | src/i18n/es.ts | Add `learn.*` block and `nav.learn` |
| 4 | src/components/layout/Header.tsx | Add "Learn" nav link in desktop and mobile menus |
| 5 | src/App.tsx | Add 4 new Route entries |
| 6 | src/features/learning/services/index.ts | Re-export progressService and streakService |

