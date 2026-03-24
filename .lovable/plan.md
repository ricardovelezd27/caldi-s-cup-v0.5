

# Plan: Fix Unhandled Async Errors in AuthContext

## Problem

Three `.then()` chains in the auth initialization `useEffect` have no `.catch()` handlers:

1. **Line 130**: `fetchProfile(session.user.id).then(setProfile)` — inside `setTimeout` in `onAuthStateChange`
2. **Line 140**: `supabase.auth.getSession().then(...)` — the entire session bootstrap
3. **Line 146**: `fetchProfile(session.user.id).then((p) => { ... })` — inside `getSession` callback

If any of these reject, the error is swallowed silently, potentially leaving the UI in a broken loading state.

## Changes

### `src/contexts/auth/AuthContext.tsx`

- Add `import { toast } from "sonner"` at top
- **Line 130** — Add `.catch()` after `.then(setProfile)`:
  ```ts
  fetchProfile(session.user.id)
    .then(setProfile)
    .catch((err) => {
      console.error("[AuthContext] Profile fetch failed on auth change:", err);
      toast.error("Could not load your profile. Please refresh the page.");
    });
  ```
- **Line 140** — Add `.catch()` to the `getSession().then(...)` chain:
  ```ts
  .catch((err) => {
    console.error("[AuthContext] Session initialization failed:", err);
    toast.error("Could not load your profile. Please refresh the page.");
    setIsLoading(false); // Ensure UI doesn't hang on spinner
  });
  ```
- **Line 146** — Add `.catch()` to the inner `fetchProfile` call:
  ```ts
  fetchProfile(session.user.id).then((p) => {
    setProfile(p);
    if (p && session.user) {
      recoverPendingTribeSave(session.user.id);
    }
  }).catch((err) => {
    console.error("[AuthContext] Profile fetch failed on init:", err);
    toast.error("Could not load your profile. Please refresh the page.");
  });
  ```

## Files Modified

| File | Change |
|------|--------|
| `AuthContext.tsx` | Add sonner import + `.catch()` handlers on 3 unhandled promise chains |

