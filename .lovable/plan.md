

## Plan: Add Scanner Signup Nudge for Anonymous Users

### Summary
Track anonymous scan count in localStorage. After 1+ scans show a subtle banner. After 3 scans, hard-gate with forced SignupPrompt modal.

### Changes

**1. `src/constants/storageKeys.ts`** — Add key:
```ts
SCANNER_PROGRESS: 'caldi_scanner_progress',
```

**2. New: `src/features/scanner/hooks/useAnonymousScanProgress.ts`**
- Mirror `useAnonymousProgress.ts` pattern exactly
- Shape: `{ scansCompleted: number, hasSeenSignupPrompt: boolean }`
- `MAX_ANONYMOUS_SCANS = 3`
- Exposes: `{ progress, recordScan, dismissSignupPrompt, shouldForceSignup, shouldShowSignupBanner }`
- `recordScan()` increments `scansCompleted`
- `shouldForceSignup` = scansCompleted >= 3
- `shouldShowSignupBanner` = scansCompleted > 0 && !hasSeenSignupPrompt
- On user login (`useEffect`), clear localStorage (no DB migration needed for scan count)

**3. `src/features/scanner/ScannerPage.tsx`**
- Import `useAnonymousScanProgress` and `SignupPrompt`
- For anonymous users only (`!user`):
  - Call `recordScan()` inside the `isComplete` useEffect (before navigate)
  - Show subtle banner between page title and mode toggle when `shouldShowSignupBanner`:
    - Caldi-styled Alert with `t("scanner.signupNudge")` text and link to `/auth`
  - When `shouldForceSignup`: show `<SignupPrompt open forceful />` and disable `ScanUploader` via `disabled={shouldForceSignup}`
- No changes to existing scan/navigation logic for authenticated users

**4. `src/i18n/en.ts`** — Add under `scanner`:
```
signupNudge: "Sign up to save your coffee discoveries!",
signupNudgeCta: "Create Free Account",
signupBenefit1: "Save your coffee discoveries",
signupBenefit2: "Build your coffee collection",
signupBenefit3: "Get personalized recommendations",
signupBenefit4: "Track your tasting journey",
```

**5. `src/i18n/es.ts`** — Add matching Spanish keys

**6. `src/features/learning/components/gamification/SignupPrompt.tsx`**
- Add optional `benefits?: string[]` prop so scanner can pass custom benefit text
- Fall back to current hardcoded learning benefits when prop is absent
- No changes to existing behavior

