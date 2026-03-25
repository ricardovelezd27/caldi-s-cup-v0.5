

## Plan: Fix Quiz State Restoration Bug + Add Back Button

### Problem 1: Quiz shows "finished" state for returning anonymous users
When a user returns to `/quiz` after completing it previously:
- `caldi_quiz_result` exists in localStorage → `OnboardingModal` skips and calls `onComplete()`
- `onComplete` sets `onboardingComplete=true` → `useEffect` calls `startQuiz()` → sets step to 1
- But `useQuizState` initializer discards completed state and returns `initialState` (empty responses, step 0)
- This creates a confusing half-state where the quiz appears active but broken

**Fix in `useQuizState.ts`**: When restoring from localStorage and `isComplete` is true, call `resetQuiz` to clear both storage keys. Also, in `OnboardingModal`, if `caldi_quiz_result` exists, the quiz should reset fully before starting fresh — the modal should still show for a true "retake" experience.

**Fix in `QuizPage.tsx`**: Add a `resetQuiz` call when the page mounts and a previous result exists but user hasn't completed onboarding (i.e., anonymous retake). This ensures clean state.

### Problem 2: No way to go back to previous questions
`QuizNavigation` only renders Skip and Next buttons. The `goToStep` function exists in the hook but is never wired up.

**Fix in `QuizNavigation.tsx`**: Add a Back button (ChevronLeft icon) that appears when `currentStep > 1`. Replace the Skip button position with Back, and keep Skip as a secondary action.

**Fix in `QuizPage.tsx`**: Wire up `goToStep` from `useQuizState` and pass `onBack={() => goToStep(currentStep - 1)}` to `QuizNavigation`.

### Changes

**1. `src/features/quiz/hooks/useQuizState.ts`**
- In the `useState` initializer: when restored state has `isComplete: true`, clear both localStorage keys and return `initialState` (already partially does this, but also clear `RESULT_STORAGE_KEY`)
- Ensure `startQuiz` always resets responses when starting fresh (create from `initialState`, not `state`)

**2. `src/features/quiz/QuizPage.tsx`**
- Destructure `goToStep` and `resetQuiz` from `useQuizState`
- On mount: if `caldi_quiz_result` exists in localStorage, call `resetQuiz()` so stale state is cleared before the onboarding modal flow starts
- Pass `onBack` prop to `QuizNavigation`

**3. `src/features/quiz/components/QuizNavigation.tsx`**
- Add `onBack` and `canGoBack` props
- Render a Back button (ChevronLeft) when `canGoBack` is true, positioned on the left
- Keep Skip as a subtle text button, Next/See Results on the right

**4. `src/i18n/en.ts` + `src/i18n/es.ts`**
- Add `quiz.back`: "Back" / "Atrás"

