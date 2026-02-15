

# Bug Fix: Quiz Results Not Persisting + Auto-Redirect to Scanner

## Problem

Edgar Andres completed the quiz but his profile shows `coffee_tribe: null` and `is_onboarded: false`. Ximena and Lia worked fine. The root cause is that tribe persistence only happens via a `useEffect` on the `/results` page, which is fragile -- if the network is spotty or the user navigates away, the save never completes and has no retry.

Additionally, the user expects the quiz to auto-continue to the scanner page after completion, but the current flow lands on a static results page.

## Fix 1: Immediate Data Fix for Edgar

Run a database query to manually set Edgar's tribe based on his quiz result (which was displayed but not saved).

Since we cannot determine his exact tribe from the DB (it was only in memory/localStorage), we will update the `ResultsPage` save logic to be more resilient so this does not happen again. Edgar will need to retake the quiz (or we can set a default tribe if the user confirms which one it was).

## Fix 2: Move Save Logic Earlier and Add Retry (ResultsPage.tsx)

The save-to-profile `useEffect` on the ResultsPage currently:
- Fires once with no retry on failure
- Silently catches errors without re-attempting
- Has no fallback if the network is temporarily down

Changes:
- Add a retry mechanism (up to 3 attempts with exponential backoff) to the save logic
- If all retries fail, store the result in localStorage with a "pending save" flag so it can be retried on next app load
- Add the pending save recovery in `AuthContext` or the ResultsPage mount

## Fix 3: Auto-Redirect to Scanner After Save (ResultsPage.tsx)

For authenticated users completing the quiz for the first time:
- After the tribe is successfully saved, auto-navigate to `/scanner` after a brief 3-second delay (so they can see their tribe reveal)
- Show a "Taking you to your first scan..." message
- Keep the manual "Go to Dashboard" and "Retake Quiz" buttons visible during the countdown so users can opt out

## Technical Details

### File: `src/features/quiz/ResultsPage.tsx`

1. **Retry save logic**: Wrap the Supabase `.update()` call in a retry loop (3 attempts, 1s/2s/4s delays). Use the existing `retryWithBackoff` utility from `src/utils/network/retryWithBackoff.ts`.

2. **Pending save fallback**: If all retries fail, save to `localStorage` under key `caldi_pending_tribe_save` with the result. On next ResultsPage mount or AuthContext init, check for pending saves and retry.

3. **Auto-redirect**: After `hasSaved` becomes `true`, start a 3-second timer then navigate to `/scanner`. Add a visible countdown indicator ("Redirecting to scanner in 3...2...1..."). If the user clicks any CTA button, cancel the timer.

4. **Redirect for first-time only**: Only auto-redirect if `profile?.is_onboarded` was `false` before the save (i.e., this is their first quiz completion, not a retake).

### File: `src/contexts/auth/AuthContext.tsx`

Add a check on auth init: if `localStorage` contains `caldi_pending_tribe_save` and user is authenticated, attempt the save immediately. This catches any saves that failed entirely on the results page.

## File Summary

| File | Action | Description |
|------|--------|-------------|
| `src/features/quiz/ResultsPage.tsx` | Edit | Add retry logic, pending save fallback, auto-redirect to scanner |
| `src/contexts/auth/AuthContext.tsx` | Edit | Add pending tribe save recovery on auth init |

## Edge Cases Handled

- Network down during save: retries 3 times, then persists to localStorage for later
- User navigates away during save: pending save recovered on next app load
- Quiz retake (already onboarded): no auto-redirect to scanner, shows normal results page
- Guest users: no change to current flow (localStorage save, sign-up CTA)

