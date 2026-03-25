

## Plan: Fix Learning Hub Flickering Dialogues, Feedback Modal Mascot, and Consolidate Lesson Completion

### Problem Summary
1. **Lesson Intro**: `getRandomDialogue()` is called during render, so every React re-render picks a new random string. The `MascotDialogue` component has a typewriter effect that restarts each time, causing constant "jumping."
2. **Feedback Modal**: Same flickering issue with `getRandomDialogue()`. Also missing mascot character illustration.
3. **Lesson Complete**: "Back to Track" triggers server-side processing (XP, streaks, progress) and then navigates — the user sees a jarring intermediate state with bonus points appearing/disappearing. Also, `onNext` is never passed, so the "Next Lesson" button never renders.

### Changes

**1. `src/features/learning/components/mascot/MascotDialogue.tsx`** — Stabilize dialogue text
- Wrap the `text` prop in a `useRef` that captures the first value and ignores subsequent changes
- This prevents the typewriter from restarting when the parent re-renders with a new random string
- Alternative: use `useMemo`/`useState` to capture initial text only

**2. `src/features/learning/components/lesson/LessonIntro.tsx`** — Stabilize greeting
- Wrap `getRandomDialogue(mascot, "greeting")` in `useMemo` (or `useState` initializer) so it's computed once per mount, not on every render

**3. `src/features/learning/components/lesson/FeedbackModal.tsx`** — Stabilize dialogue + add mascot
- Wrap `getRandomDialogue()` in `useMemo` keyed on `[open, isCorrect]` so it picks one dialogue per modal open
- Add `MascotCharacter` component in the header band next to the check/X icon, replacing the plain icon circle with the mascot illustration (mood: "celebrating" for correct, "thinking" for incorrect)

**4. `src/features/learning/components/lesson/LessonScreen.tsx`** — Consolidate completion flow
- Move the server-side processing (`handleLessonDone`) to trigger automatically when `lesson.state` becomes `"complete"` via a `useEffect`, instead of on button click
- The LessonComplete screen renders only after processing finishes (show a brief loading skeleton while processing)
- Add a `getNextLessonId` query: fetch lessons in the same unit ordered by `sort_order`, find the one after current `lessonId`
- Pass `onNext` to `LessonComplete` that navigates to `/learn/${trackId}/lesson/${nextLessonId}`
- If no next lesson exists, omit `onNext` (only "Back to Track" shows)

**5. `src/features/learning/services/learningService.ts`** — Add `getNextLesson` helper
- New function `getNextLessonInTrack(currentLessonId, trackId)` that:
  1. Gets the current lesson's `unit_id` and `sort_order`
  2. Looks for the next lesson in the same unit (sort_order > current)
  3. If none, looks for the first lesson of the next unit in the same section
  4. Returns the lesson ID or null

**6. `src/i18n/en.ts` and `src/i18n/es.ts`** — Add keys:
- `learn.continueLearning` / "Continue Learning" / "Seguir Aprendiendo"
- `learn.processingResults` / "Saving your results..." / "Guardando tus resultados..."

### Technical Details

The root cause of the flickering is `getRandomDialogue()` being a pure function with `Math.random()` called during render. Every re-render (state change, context update) generates a new string, and `MascotDialogue`'s typewriter `useEffect` depends on `[text]`, so it restarts the animation.

For the completion flow consolidation: currently `onBackToTrack` calls `handleLessonDone` which does async work and then `onComplete()` (navigate). This means the user clicks "Back to Track", sees a processing state, then gets redirected. Instead, processing should happen automatically when the lesson ends, and the complete screen should show results after processing is done.

