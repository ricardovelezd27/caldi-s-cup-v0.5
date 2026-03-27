

## Plan: Fix Exercise Bugs + Mobile Leaderboard Pills

### Issue Analysis

1. **True/False missing question text**: The `TrueFalse` component renders `data.statement` but the statement field is empty or missing. The transformer maps `ex.question` → `statement`, which is correct. The real issue is likely the exercise was imported before the transformer existed, or the `question` field was empty in the JSON. Need to verify DB data — but the component-side fix is to also render `data.question` as fallback if `statement` is empty.

2. **Multiple Choice correct answer not highlighting correctly (screenshots 2 & 3)**: The feedback modal shows "Not quite" even when the correct answer was selected. Looking at the code, `MultipleChoice` uses `selected === data.correct_answer` — the `correct_answer` field comes from the transformer which maps `ex.correct_answer_id ?? ex.correct_answer`. The issue is likely data: the `correct_answer` value in DB doesn't match any option `id`. Need to verify, but the fix is defensive: ensure the transformer correctly maps `correct_answer_id`.

3. **Matching Pairs: clicking one left item selects all**: The bug is in the `global border-width: 4px !important` CSS rule from the style guide. All buttons get `border-width: 4px !important` and `box-shadow: 4px 4px 0px 0px var(--border) !important`, which overrides the conditional border styling. The `border-primary` class for the selected item is applied, but the `border-border/30` for unselected items may be visually indistinguishable because the thick 4px border makes all items look "selected." The right column not being clickable is because `disabled={!selectedLeft}` — the user must first click a left item. The visual issue is the global CSS making all items look the same.

4. **Mobile layout for leaderboard/rank**: Convert the bottom LearnPageLeaderboard and RankProgressCard cards into pills on mobile, with tap-to-open modals showing the full content.

### File Changes

**1. `TrueFalse.tsx`** — Add fallback for empty statement
- Render `data.statement || (data as any).question || ""` as the statement text
- This handles exercises where `statement` is empty but `question` exists

**2. `MultipleChoice.tsx`** — No component changes needed (logic is correct)
- The issue is data-level. The transformer already handles `correct_answer_id` → `correct_answer`.
- Need to check if the specific lesson data has mismatched IDs. Will add a defensive normalization.

**3. `exerciseFormatTransformer.ts`** — Harden the `multiple_choice` transformer
- Ensure `correct_answer` is always set to `correct_answer_id` when present
- For `true_false`, ensure `statement` is never empty by falling back to `question`

**4. `MatchingPairs.tsx`** — Fix visual bug with global CSS
- The `border-2` class is overridden by the global `border-width: 4px !important` rule
- Fix: use inline styles for border-width to override the `!important` or use more specific class selectors
- Also ensure right column buttons are clickable even without a left selection (allow right-first selection pattern)
- Fix the visual distinction: when no item is selected, use a lighter/no border; when selected, use the primary colored border clearly

**5. `LearnPage.tsx`** — Mobile: convert sidebar to pills + modals
- On mobile (`lg:` breakpoint), hide the sidebar cards
- Add two new pills to the gamification bar row: "🏆 Leaderboard" and rank icon pill
- Clicking each pill opens a Dialog/Sheet with the full `LearnPageLeaderboard` or `RankProgressCard` content
- On desktop: keep the current two-column layout unchanged

**6. New: `src/features/learning/components/gamification/LeaderboardPillModal.tsx`**
- A pill button + Dialog that wraps `LearnPageLeaderboard` content
- Matches the existing pill style (rounded-full, border-2, shadow)

**7. New: `src/features/learning/components/gamification/RankPillModal.tsx`**
- A pill button + Dialog that wraps `RankProgressCard` content
- Shows current rank icon + name in the pill

### Summary of Changes

| File | Fix |
|---|---|
| `TrueFalse.tsx` | Fallback to `question` field if `statement` is empty |
| `exerciseFormatTransformer.ts` | Ensure `statement` is never empty for true_false |
| `MatchingPairs.tsx` | Fix border styling to work with global 4px !important CSS; improve visual distinction between selected/unselected |
| `LearnPage.tsx` | Add leaderboard + rank pills on mobile; hide sidebar cards on mobile |
| `LeaderboardPillModal.tsx` (new) | Pill + modal for mobile leaderboard |
| `RankPillModal.tsx` (new) | Pill + modal for mobile rank progress |

