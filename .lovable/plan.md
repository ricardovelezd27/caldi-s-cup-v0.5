

## Plan: XP Audit + Leaderboard Integration

### Part 1: XP & Level Progression Audit

**Finding: XP pipeline is correct.** Reviewed `xpService.ts`, `LessonScreen.tsx`, `useUserRank`, and `useAwardXP`. The lesson completion pipeline correctly: (1) calculates XP with bonuses, (2) updates `learning_user_streaks.total_xp` via RPC, (3) updates `profiles.total_xp`, (4) updates daily goals and league weekly XP. The rank progression in `useUserRank` correctly maps `profiles.total_xp` to 6 Barista Ranks. No bugs found — no changes needed.

### Part 2: Learn Page Two-Column Layout + Leaderboard Sidebar

Redesign `LearnPage.tsx` into a responsive two-column layout inspired by the coffee profile page's `grid-cols-1 lg:grid-cols-12` pattern.

```text
┌─────────────────────────────────────────────┐
│           Coffee Learning Hub               │
├──────────────────────┬──────────────────────┤
│  🔥 3  ⎯ 15/20 XP   │  🏆 Leaderboard      │
│                      │  #1 User 🤎 45 XP    │
│  Track Cards (list)  │  #2 You  💛 38 XP    │
│  ☕ Bean Knowledge   │  #3 User 📄 25 XP    │
│  🔬 Brewing Science  │                      │
│  📖 History & Culture│  ┌──────────────────┐│
│  🌿 Sustainability   │  │ Your Rank        ││
│                      │  │ 🤎 Bronze Tamper ││
│                      │  │ ████░░ 65%       ││
│                      │  └──────────────────┘│
└──────────────────────┴──────────────────────┘
```

Mobile: single column — tracks first, leaderboard + rank card below.

### Part 3: Post-Lesson Leaderboard Snapshot

After lesson completion, show the user their current leaderboard position: "📊 You're #3 of 25 learners this week."

---

### File Changes

**1. `src/features/learning/pages/LearnPage.tsx`**
- Restructure to `grid grid-cols-1 lg:grid-cols-12 gap-8`
- Left column (`lg:col-span-7`): header, gamification bar, TrackGrid (force single-column with new prop)
- Right column (`lg:col-span-5`): sticky sidebar with `LearnPageLeaderboard` + `RankProgressCard`
- Anonymous signup banner below the grid

**2. New: `src/features/learning/components/gamification/LearnPageLeaderboard.tsx`**
- Compact sidebar leaderboard card (top 10 users)
- Reuses `useLeague` hook data
- Current user row highlighted with secondary color
- "View Full Leaderboard" link to `/leaderboard`
- Empty state: "Complete lessons to join the leaderboard"
- On-brand: thick borders, Bangers headings, card shadows

**3. New: `src/features/learning/components/gamification/RankProgressCard.tsx`**
- Shows current Barista Rank icon + name + total XP
- Progress bar to next rank using existing `Progress` component
- "X XP to next rank" label
- Uses `useUserRank` hook

**4. `src/features/learning/components/track/TrackGrid.tsx`**
- Add optional `singleColumn` prop to force `grid-cols-1` layout (for sidebar-adjacent display)

**5. `src/features/learning/components/lesson/LessonComplete.tsx`**
- Add optional `leaderboardRank` and `leaderboardTotal` props
- Render a compact info row: "📊 You're #X of Y learners this week" between XP breakdown and score stats
- Only shown for logged-in users with league data

**6. `src/features/learning/components/lesson/LessonScreen.tsx`**
- After processing results, fetch leaderboard position via `getLeaderboard`
- Pass `leaderboardRank` and `leaderboardTotal` to `LessonComplete`

**7. `src/i18n/en.ts` + `src/i18n/es.ts`**
- Add keys: `learn.leaderboard.yourPosition`, `learn.leaderboard.ofLearners`, `learn.leaderboard.joinByLearning`, `learn.leaderboard.viewFull`, `learn.rankProgress.title`, `learn.rankProgress.xpToNext`

