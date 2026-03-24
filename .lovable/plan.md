

## Plan: Enforce Lesson Locking at Route Level

### Problem
Lesson locking is visual-only in `TrackPathView`. A user can type `/learn/:trackId/:lessonId` directly and access any lesson, bypassing the progression system.

### Solution

Three changes across three files, plus i18n keys for the lock screen.

### 1. `progressService.ts` — Add `isLessonUnlocked()`

New async function that:
- Fetches the target lesson's `unit_id` and `sort_order`
- If `sort_order === 0` (first in unit), checks if the unit is in the first section or if prerequisite sections are completed — but for simplicity, first lesson in a unit checks if previous unit's last lesson is completed (or if it's the very first lesson overall, it's always unlocked)
- Otherwise, queries `learning_lessons` for the lesson with `sort_order - 1` in the same `unit_id`, then checks `learning_user_progress` for that lesson
- For anonymous users: checks localStorage `caldi_learning_progress` for the previous lesson ID in the completed list
- Returns `{ unlocked: boolean; previousLessonId?: string }`

### 2. `useTrackPath.ts` — Enforce section prerequisites

Current logic uses a single `foundFirstAvailable` flag across all sections without checking `requiresSectionId`. Fix:
- Before processing a section's lessons, if `section.requiresSectionId` is set, check whether ALL lessons in the required section are in `progressByLessonId`. If not, mark all lessons in this section as `locked` regardless.
- This ensures section-level gating works properly.

### 3. `LessonPage.tsx` — Route-level guard

- Add a `useQuery` that calls `isLessonUnlocked(userId, lessonId)` (or the anonymous variant)
- While loading, show a spinner/skeleton
- If locked, render a card with a `Lock` icon, translated message ("Complete the previous lesson first"), and a back button to the track page
- If unlocked, render `LessonScreen` as before

### 4. i18n keys

Add to both `en.ts` and `es.ts`:

| Key | EN | ES |
|---|---|---|
| `learn.lessonLocked` | This lesson is locked | Esta leccion esta bloqueada |
| `learn.completePrevious` | Complete the previous lesson first | Completa la leccion anterior primero |
| `learn.backToTrack` | Back to track | Volver al track |

### Files to modify
- `src/features/learning/services/progressService.ts` — add `isLessonUnlocked()`
- `src/features/learning/hooks/useTrackPath.ts` — enforce `requiresSectionId` gating
- `src/features/learning/pages/LessonPage.tsx` — add unlock check before rendering
- `src/i18n/en.ts` — add 3 keys
- `src/i18n/es.ts` — add 3 keys

