

# Plan: Fix Silent Error Swallowing in ResultsPage

## Problem

`ResultsPage.tsx` has 5 empty `catch` blocks that silently swallow errors. The most critical one (line 38) swallows localStorage JSON parse failures without logging or cleanup, which could leave corrupted data in place.

## Changes — `src/features/quiz/ResultsPage.tsx`

### 1. Line 37 — `localStorage.setItem` for saving result (guest user)
Currently: `catch { /* ignore */ }`
Change: Log warning. This is a non-critical write failure (guest convenience), so logging is sufficient.
```ts
catch (err) { console.error("[ResultsPage] Failed to cache quiz result:", err); }
```

### 2. Line 38 — `localStorage.getItem` + `JSON.parse` for loading result
Currently: `catch { navigate('/quiz'); }`
Change: Log error, clear corrupted keys, then redirect.
```ts
catch (err) {
  console.error("[ResultsPage] Failed to parse cached quiz result:", err);
  localStorage.removeItem(RESULT_STORAGE_KEY);
  localStorage.removeItem('caldi_quiz_state');
  navigate('/quiz');
}
```

### 3. Line 63 — `localStorage.removeItem` cleanup after successful save
Currently: `catch { /* ignore */ }`
Change: Log warning. Non-critical cleanup failure.
```ts
catch (err) { console.error("[ResultsPage] Failed to clear localStorage after save:", err); }
```

### 4. Line 67 — `localStorage.setItem` for pending tribe save fallback
Currently: `catch { /* ignore */ }`
Change: Log error. This is the fallback when the API save already failed — losing this too is worth knowing about.
```ts
catch (err) { console.error("[ResultsPage] Failed to persist pending tribe save:", err); }
```

### 5. Line 74 — `localStorage.removeItem` in `handleRetake`
Currently: `catch { /* ignore */ }`
Change: Log warning.
```ts
catch (err) { console.error("[ResultsPage] Failed to clear localStorage on retake:", err); }
```

## Files Modified

| File | Change |
|------|--------|
| `ResultsPage.tsx` | Replace 5 empty catch blocks with `console.error` + cleanup where applicable |

