

# Plan: Clear App State on Logout

## Problem

When a user logs out and a different user logs in on the same device, stale localStorage data (`caldi_pending_tribe_save`, `caldi_quiz_result`) from the previous session can bleed into the new session.

## Change

### `src/contexts/auth/AuthContext.tsx` — `signOut()` (line 247)

After `supabase.auth.signOut()` and `setProfile(null)`, add two `localStorage.removeItem` calls:

```ts
localStorage.removeItem('caldi_pending_tribe_save');
localStorage.removeItem('caldi_quiz_result');
```

Language preference (`caldi_lang`) is intentionally preserved.

| File | Change |
|------|--------|
| `AuthContext.tsx` | Add 2 `localStorage.removeItem` calls in `signOut()` |

