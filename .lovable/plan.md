

# Plan: Three Code Quality Improvements

## QUALITY-001: Extract `transformCoffeeRow()` helper

### `src/features/coffee/services/coffeeService.ts`

Extract the 25-line mapping block (repeated 3 times) into a single `transformCoffeeRow(row: any): Coffee` function at the top. Then replace all three instances with calls to it.

```ts
function transformCoffeeRow(row: any): Coffee {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    imageUrl: row.image_url,
    // ... all fields ...
  };
}
```

- `getCoffeeById`: `return transformCoffeeRow(data);`
- `getVerifiedCoffees`: `return (data ?? []).map(transformCoffeeRow);`
- `getAllCoffees`: `return (data ?? []).map(transformCoffeeRow);`

---

## QUALITY-002: Centralize localStorage keys

### New file: `src/constants/storageKeys.ts`

```ts
export const STORAGE_KEYS = {
  PENDING_TRIBE_SAVE: 'caldi_pending_tribe_save',
  QUIZ_RESULT: 'caldi_quiz_result',
  QUIZ_STATE: 'caldi_quiz_state',
  LANGUAGE: 'caldi_lang',
  LEARNING_PROGRESS: 'caldi_learning_progress',
} as const;
```

### Files to update (replace hardcoded strings with `STORAGE_KEYS.*`):

| File | Keys used |
|------|-----------|
| `src/contexts/auth/AuthContext.tsx` | `PENDING_TRIBE_SAVE`, `QUIZ_RESULT` |
| `src/contexts/language/LanguageContext.tsx` | `LANGUAGE` |
| `src/features/quiz/ResultsPage.tsx` | `QUIZ_RESULT`, `PENDING_TRIBE_SAVE`, `QUIZ_STATE` |
| `src/features/quiz/hooks/useQuizState.ts` | `QUIZ_STATE`, `QUIZ_RESULT` |
| `src/features/quiz/components/OnboardingModal.tsx` | `QUIZ_RESULT` |
| `src/features/profile/ProfilePage.tsx` | `QUIZ_RESULT`, `QUIZ_STATE` |
| `src/features/profile/components/RetakeQuizSection.tsx` | `QUIZ_RESULT`, `QUIZ_STATE` |
| `src/features/learning/hooks/useAnonymousProgress.ts` | `LEARNING_PROGRESS` |

---

## QUALITY-003: Move test deps to devDependencies

### `package.json`

Move from `dependencies` to `devDependencies`:
- `vitest` (line 67)
- `jsdom` (line 53)
- `@testing-library/jest-dom` (line 45)
- `@testing-library/react` (line 46)

---

## Summary

| File | Change |
|------|--------|
| `coffeeService.ts` | Extract `transformCoffeeRow()`, use in 3 functions |
| `src/constants/storageKeys.ts` | New file with all localStorage key constants |
| 8 files | Replace hardcoded localStorage strings with `STORAGE_KEYS.*` |
| `package.json` | Move 4 test packages to `devDependencies` |

