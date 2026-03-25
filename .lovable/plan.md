

## Plan: Guard OnboardingFlow for authenticated users

Add an auth check at the top of `OnboardingFlow` so unauthenticated visitors are redirected to `/quiz`.

### Changes

**`src/features/onboarding/OnboardingFlow.tsx`**
- After the existing hooks (`useAuth`, etc.), add an early `useEffect` or guard: if `!user && !isLoading`, redirect to `ROUTES.quiz` with `replace: true`
- Return `null` while redirecting to prevent flash of onboarding UI
- All existing logic remains untouched

Single file, ~5 lines added.

