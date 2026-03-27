

## Plan: Hearts Modal Timing, Learn Page Redesign (Mobile)

### 1. Hearts Empty Modal — Show Immediately on Last Heart Lost

**Problem**: The modal only shows when entering a lesson with 0 hearts, not immediately when the last heart is lost during an exercise.

**Fix in `LessonScreen.tsx`**: The `handleSubmitAnswer` callback checks `hearts <= 1` but `hearts` is stale (pre-mutation). The fix: after `loseHeart()` resolves, check the new count. Since `loseHeart` decrements by 1, if `hearts === 1` before the call, the result is 0 — so the condition `hearts <= 1` is correct but may race with the query invalidation. Fix by setting `showHeartsEmpty(true)` synchronously when `hearts === 1` (i.e., about to hit 0) before awaiting the mutation.

### 2. Learn Page Mobile Redesign

**New layout for logged-in mobile users:**

```text
┌─────────────────────────────┐
│  [Avatar] Display Name      │  ← mini profile header
├─────────────────────────────┤
│  🔥 3   🎯 15/20   🏆 #4   │  ← 3 pills, centered
├─────────────────────────────┤
│  🎽 Green Apron → 🤎 Bronze│  ← rank progress bar
│  ████████████░░░░  157 XP   │
├─────────────────────────────┤
│  ❤️❤️❤️🩶🩶               │  ← hearts pill
├─────────────────────────────┤
│  [Track cards...]           │
└─────────────────────────────┘
```

**Changes to `LearnPage.tsx`**:
- Remove the "Learning Hub" title/subtitle header on mobile (keep on desktop)
- Add a mini profile row: small circular `ProfileAvatar` (32px) + display name, left-aligned
- Below: 3 pills centered — Streak, DailyGoalRing, Leaderboard position pill (showing `#N`)
- Below: inline rank progress bar (reuse `RankProgressCard` logic but as a compact bar, not a card) showing `icon CurrentRank → icon NextRank` with progress bar and "X XP to NextRank"
- Below: Hearts pill showing current heart count (using `HeartsDisplay` or a simplified version)
- Remove `RankPillModal` — replaced by the inline bar
- Keep `LeaderboardPillModal` but update the pill to show `🏆 #N` (user's rank from `useLeague().myRank`)
- On desktop: keep existing two-column layout unchanged

**New component: `RankProgressBar.tsx`** — a compact, card-less version of `RankProgressCard`:
- Single row: `currentRank.icon CurrentRank.name → nextRank.icon NextRank.name`
- Progress bar below
- "X XP to NextRank" text

**Hearts pill on Learn page**: Add `useHearts()` to `LearnPage.tsx`, render a pill with heart emoji + count. Tapping it could show `HeartsEmptyModal` if empty, otherwise just informational.

### Files to Change

| File | Change |
|---|---|
| `LessonScreen.tsx` | Fix hearts modal to show immediately when last heart lost (check `hearts === 1` before mutation) |
| `LearnPage.tsx` | Redesign mobile layout: profile header, centered pills, rank bar, hearts pill; remove title on mobile |
| `RankProgressBar.tsx` (new) | Compact inline rank progress bar component |
| `LeaderboardPillModal.tsx` | Update pill to show `🏆 #N` using `useLeague().myRank` |
| `HeartsDisplay.tsx` | Minor: ensure it works as a standalone pill on the learn page |

