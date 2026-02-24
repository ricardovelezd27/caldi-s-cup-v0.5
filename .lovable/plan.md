

# Plan: Set Up Testing Infrastructure and Write Initial Tests

## Summary

The project has no testing infrastructure yet. This plan sets up Vitest with React Testing Library and creates a focused suite of tests for the learning module built across Phases 1-3.

---

## Step 1: Install Testing Dependencies

Add to `devDependencies` in `package.json`:

- `vitest` (^3.2.4)
- `@testing-library/jest-dom` (^6.6.0)
- `@testing-library/react` (^16.0.0)
- `jsdom` (^20.0.3)

---

## Step 2: Create Testing Configuration

**`vitest.config.ts`** (new file at project root):
- Uses `@vitejs/plugin-react-swc`
- Environment: `jsdom`
- Globals enabled
- Setup file: `src/test/setup.ts`
- Includes: `src/**/*.{test,spec}.{ts,tsx}`
- Path alias: `@` -> `./src`

**`src/test/setup.ts`** (new file):
- Imports `@testing-library/jest-dom`
- Mocks `window.matchMedia`
- Mocks `AudioContext` (needed because `sounds.ts` uses Web Audio API)

**`tsconfig.app.json`** (modify):
- Add `"vitest/globals"` to `compilerOptions.types`

---

## Step 3: Write Tests

Tests are organized by the testability layers -- pure logic first, then components.

### 3a. Pure Logic Tests (no React, no mocking needed)

**`src/features/learning/data/mascotDialogues.test.ts`**:
- `getRandomDialogue('caldi', 'correct')` returns a string from the caldi correct array
- `getRandomDialogue('goat', 'greeting')` returns a string from the goat greeting array
- Template replacement: `getRandomDialogue('caldi', 'streak', { days: 7 })` returns string containing "7"
- Fallback: unknown category falls back gracefully

**`src/features/learning/styles/exerciseTokens.test.ts`**:
- Smoke test: `EXERCISE_COLORS` has expected keys (correct, incorrect, selected, etc.)
- `EXERCISE_TIMING` has expected keys and positive number values

### 3b. Component Tests (with React Testing Library)

**`src/features/learning/components/exercises/base/ExerciseOption.test.tsx`**:
- Renders children text
- Shows selected state styling when `isSelected=true`
- Shows correct state styling when `isCorrect=true`
- Shows incorrect state styling when `isCorrect=false`
- Calls `onClick` when clicked
- Does not call `onClick` when `isDisabled=true`
- Renders letter prefix (A, B, C) when `letterIndex` is provided

**`src/features/learning/components/exercises/base/CheckButton.test.tsx`**:
- Renders "Check" text in disabled state
- Button is disabled when state is "disabled"
- Button is clickable when state is "ready"
- Renders "Continue" text in correct/incorrect states
- Calls `onClick` when clicked in ready state

**`src/features/learning/components/exercises/knowledge/MultipleChoice.test.tsx`**:
- Renders the question text
- Renders all option texts
- Selecting an option enables the check button
- Submitting a correct answer calls `onSubmit` with `(answerId, true)`
- Submitting an incorrect answer calls `onSubmit` with `(answerId, false)`

**`src/features/learning/components/exercises/knowledge/TrueFalse.test.tsx`**:
- Renders the statement text
- Renders True and False buttons
- Selecting True and checking with `correct_answer: true` calls `onSubmit` with `(true, true)`

**`src/features/learning/components/exercises/applied/Calculation.test.tsx`**:
- Renders the question
- Typing a correct answer and checking calls `onSubmit` with correct=true
- Typing an answer within tolerance calls `onSubmit` with correct=true
- Typing an answer outside tolerance calls `onSubmit` with correct=false

### 3c. Test Wrapper Utilities

**`src/test/test-utils.tsx`** (new file):
- Custom `render` function that wraps components in required providers (LanguageContext, QueryClientProvider, BrowserRouter)
- Re-exports everything from `@testing-library/react`

This wrapper is needed because exercise components use `useLanguage()` and some components use router hooks.

---

## Step 4: Run Tests

Use the run-tests tool to execute the suite and verify everything passes.

---

## Test Count Summary

| Category | File | Tests (approx) |
|---|---|---|
| Pure logic | mascotDialogues.test.ts | 4 |
| Pure logic | exerciseTokens.test.ts | 2 |
| Base component | ExerciseOption.test.tsx | 7 |
| Base component | CheckButton.test.tsx | 5 |
| Knowledge exercise | MultipleChoice.test.tsx | 5 |
| Knowledge exercise | TrueFalse.test.tsx | 3 |
| Applied exercise | Calculation.test.tsx | 4 |
| **Total** | | **~30** |

---

## Technical Notes

- All component tests mock the `sounds` module to avoid `AudioContext` errors in jsdom
- The `useLanguage` hook is provided via a test wrapper that defaults to English
- Tests focus on behavior (user interactions and callback contracts), not implementation details, per the TDD mandate
- No Supabase calls are made in these tests -- service layer tests would require mocking the Supabase client and are deferred to a separate pass

