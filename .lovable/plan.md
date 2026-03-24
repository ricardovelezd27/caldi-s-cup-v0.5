

# Plan: Validate localStorage Data Before Use

## Problem

Both `AuthContext.tsx` and `ResultsPage.tsx` parse localStorage JSON and use it without validating the shape matches expected types. Malformed or tampered data could cause runtime errors or write invalid values to the database.

## Changes

### 1. `src/contexts/auth/AuthContext.tsx` — Validate pending tribe save

In `recoverPendingTribeSave` (line 90-91), after `JSON.parse`, replace the loose `result?.tribe` check with a strict tribe validation:

```ts
const VALID_TRIBES = ['fox', 'owl', 'hummingbird', 'bee'];
const result = JSON.parse(pending);
if (!result || typeof result !== 'object' || !VALID_TRIBES.includes(result.tribe)) {
  console.warn('[AuthContext] Invalid pending tribe save data, removing');
  localStorage.removeItem(PENDING_TRIBE_SAVE_KEY);
  return;
}
```

### 2. `src/features/quiz/ResultsPage.tsx` — Validate cached quiz result

On line 38, after `JSON.parse(saved)`, validate the parsed object has valid `tribe`, `scores`, and `percentages` before calling `setResult`:

```ts
const parsed = JSON.parse(saved);
const VALID_TRIBES = ['fox', 'owl', 'hummingbird', 'bee'];
if (
  !parsed || typeof parsed !== 'object' ||
  !VALID_TRIBES.includes(parsed.tribe) ||
  !parsed.scores || typeof parsed.scores !== 'object'
) {
  console.error("[ResultsPage] Invalid cached quiz result shape, clearing");
  localStorage.removeItem(RESULT_STORAGE_KEY);
  localStorage.removeItem('caldi_quiz_state');
  navigate('/quiz');
  return;
}
setResult(parsed);
```

Also validate `stateResult` from `location.state` (line 37) with the same check before using it.

## Files Modified

| File | Change |
|------|--------|
| `AuthContext.tsx` | Strict tribe enum validation on parsed pending save |
| `ResultsPage.tsx` | Shape validation on cached quiz result + location state result |

