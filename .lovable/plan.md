

# Fix Sign-In Redirect and Onboarding Modal Logic

## Problem
1. After sign-in, users without a completed quiz are forced to `/quiz` instead of going back to what they were doing (e.g., `/scanner`).
2. The onboarding modal appears every time a user visits `/quiz`, even if they already completed it, because it only checks `localStorage` -- not the user's profile in the database.

## Changes

### 1. Auth.tsx -- Always redirect to scanner (or origin page)
Remove the branching logic that sends non-onboarded users to `/quiz`. After sign-in, ALL users go to `location.state.from` (the page they came from) or `/scanner` as the default fallback. The quiz becomes optional and self-service, not a forced gate after login.

**Before:** Non-onboarded users forced to `/quiz`, onboarded users to dashboard.
**After:** All users go to their origin page or `/scanner`.

### 2. OnboardingModal -- Respect profile.is_onboarded
Currently the modal checks only `localStorage('caldi_quiz_result')`. This is unreliable across devices/browsers. Add a check for the user's profile: if `profile.is_onboarded === true` or `profile.coffee_tribe` is set, never show the modal (treat as completed). The modal will accept an optional `isOnboarded` prop from the QuizPage.

### 3. QuizPage -- Pass onboarding status to modal
QuizPage will read `useAuth()` and pass the profile's onboarding status to the OnboardingModal so it can suppress itself for users who already completed the quiz.

## Technical Details

### Auth.tsx (lines 18-28)
Replace the redirect `useEffect` with:
```typescript
useEffect(() => {
  if (user && !isLoading) {
    const from = (location.state as { from?: string })?.from || ROUTES.scanner;
    navigate(from, { replace: true });
  }
}, [user, profile, isLoading, navigate, location.state]);
```

### OnboardingModal.tsx (lines 94-107)
Add `isOnboarded` prop. Update the effect to skip showing the modal when the user has already completed onboarding:
```typescript
interface OnboardingModalProps {
  onComplete: () => void;
  forceShow?: boolean;
  onClose?: () => void;
  isOnboarded?: boolean; // from profile
}
```
In the effect: if `isOnboarded` is true, call `onComplete()` and don't open.

### QuizPage.tsx
Pass `profile?.is_onboarded` to `OnboardingModal`:
```tsx
<OnboardingModal 
  onComplete={handleOnboardingComplete}
  forceShow={forceShowOnboarding}
  onClose={handleOnboardingClose}
  isOnboarded={!!profile?.is_onboarded}
/>
```

### Files Modified
1. `src/pages/Auth.tsx` -- simplify redirect to always go to origin or `/scanner`
2. `src/features/quiz/components/OnboardingModal.tsx` -- add `isOnboarded` prop check
3. `src/features/quiz/QuizPage.tsx` -- pass onboarding status to modal

