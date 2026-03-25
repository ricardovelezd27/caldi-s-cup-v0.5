

## Plan: Migrate Anonymous Progress on Signup

### Summary
Replace the `localStorage.removeItem` cleanup in `useAnonymousProgress` with a migration that persists anonymous lesson completions and XP to the database when a user signs in.

### Changes

**1. `src/features/learning/services/progressService.ts`**
- Add `migrateAnonymousProgress(userId, progress)` function
- For each `lessonsCompleted` entry, call `upsertLessonProgress` with minimal data (isCompleted: true, xpEarned: 0 since XP is handled separately)
- Award accumulated `totalXP` via `awardXP(userId, 'anonymous_migration', totalXP)` from xpService
- Entire function wrapped in try/catch — errors logged but never thrown

**2. `src/features/learning/hooks/useAnonymousProgress.ts`**
- Replace the `useEffect` that does `localStorage.removeItem` with one that:
  1. Reads current progress
  2. If `lessonsCompleted.length > 0`, calls `migrateAnonymousProgress(userId, progress)`
  3. Then clears localStorage
- Fire-and-forget pattern: `migrateAnonymousProgress(...).then(() => localStorage.removeItem(...))`

### Key details
- Uses existing `upsertLessonProgress` — no new DB calls
- Uses existing `awardXP` from `xpService` for XP migration
- Migration failures are caught and logged; login is never blocked
- localStorage is only cleared after successful migration (or on error, to avoid retry loops)

