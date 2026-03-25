

## Plan: Simplify Quiz Navigation + Remove localStorage Persistence

### Changes

**1. `src/features/quiz/components/QuizNavigation.tsx`** — Simplify to Back icon + Next only
- Remove the "Back" text label, keep only `ChevronLeft` icon
- Remove the Skip button entirely
- Remove `canSkip` and `onSkip` props
- Layout: back icon on left, Next/See Results button on right

**2. `src/features/quiz/hooks/useQuizState.ts`** — Remove all localStorage
- Remove `persistState`, `saveGuestResult`, `getGuestResult` functions
- Remove localStorage reads from `useState` initializer — always start from `initialState`
- Remove `skipScenario` (no longer needed)
- Keep everything in-memory only; anonymous users always start fresh on page load

**3. `src/features/quiz/QuizPage.tsx`** — Clean up
- Remove `skipScenario` from hook destructure
- Remove `onSkip`/`canSkip` props from `QuizNavigation`

**4. `src/features/quiz/ResultsPage.tsx`** — Remove localStorage fallback
- Remove reading results from `localStorage` — if no `location.state.result` and user has no profile tribe, redirect to `/quiz`
- For signed-in users, result is already saved to `profiles.coffee_tribe` via Supabase
- Remove localStorage cleanup calls (no longer relevant)
- Keep the `PENDING_TRIBE_SAVE_KEY` fallback for resilience on save failure only

**5. `src/features/quiz/components/OnboardingModal.tsx`** — Remove localStorage check
- Remove the `localStorage.getItem(QUIZ_RESULT_KEY)` check
- For non-onboarded users: always show the onboarding modal (they haven't completed the quiz in this session)
- For onboarded users (`isOnboarded=true`): skip modal as before

**6. `src/contexts/auth/AuthContext.tsx`** — Remove `QUIZ_RESULT` and `QUIZ_STATE` cleanup from `signOut`
- These keys no longer exist in localStorage

### Technical Notes
- Quiz in-progress state lives in React state (memory) only — refreshing the page resets the quiz for anonymous users
- The only persistent quiz data is `profiles.coffee_tribe` in the database (set on the results page for signed-in users)
- `PENDING_TRIBE_SAVE` localStorage key is retained as a resilience mechanism for failed Supabase writes, recovered by `AuthContext` on next login

