

## Plan: Fix Hearts-Empty Flow During Lessons

### Root Cause

There are two bugs causing the freeze:

1. **Both modals fight for visibility**: When a user gets a wrong answer on their last heart, `handleSubmitAnswer` sets `showHeartsEmpty = true` immediately (line 87) AND the lesson transitions to `"feedback"` state showing the `FeedbackModal`. Both modals try to render simultaneously, but the exercise/feedback section (lines 286-342) does NOT render `HeartsEmptyModal` — it's only rendered in the intro and fallback sections. So the hearts-empty modal never appears during exercises, and the feedback modal's Continue button tries to set it again but it's still not rendered in that branch.

2. **Missing `HeartsEmptyModal` in the exercise/feedback render branch**: Lines 286-342 handle the exercise state but never include a `<HeartsEmptyModal>`. The modal only exists in the intro (line 276) and fallback (line 414) branches.

### Fix

**File: `src/features/learning/components/lesson/LessonScreen.tsx`**

Three changes:

1. **Remove premature hearts-empty trigger from `handleSubmitAnswer`**: Don't show the hearts-empty modal immediately on wrong answer. Instead, let the feedback modal appear first. The user sees "Incorrect", clicks Continue, and THEN gets the hearts-empty modal.

2. **Add `HeartsEmptyModal` to the exercise/feedback render branch**: Place it after the `FeedbackModal` so it can actually render when `showHeartsEmpty` is set to true.

3. **Fix the `onContinue` handler in `FeedbackModal`**: After the feedback modal's Continue is pressed, check if hearts are now 0. If so, set `showHeartsEmpty = true` and return (don't advance to next exercise). The current code at line 334 already does this check (`if (hearts === 0 && user)`), but because `handleSubmitAnswer` already called `loseHeart()` which is async and `hearts` comes from a query that hasn't invalidated yet, the value is stale. Fix: track the "effective hearts" locally after a loss so the check is synchronous and accurate.

**Detailed changes:**

```
handleSubmitAnswer:
  - Remove line 87: `if (hearts <= 1) setShowHeartsEmpty(true);`
  - Instead, track local effective hearts: add a ref `effectiveHeartsRef` initialized from `hearts`, decremented on wrong answer

FeedbackModal onContinue:
  - Check `effectiveHeartsRef.current <= 0` instead of `hearts === 0`
  - If true, set showHeartsEmpty = true and return

Exercise/feedback render branch (lines 286-342):
  - Add `<HeartsEmptyModal open={showHeartsEmpty} onOpenChange={setShowHeartsEmpty} timeUntilRefill={timeUntilRefill} />` after the closing `</PageLayout>`

Intro branch:
  - Block lesson.startLesson when hearts = 0: wrap onStart to check hasHearts first, show modal if not
```

### Flow After Fix

**Case 1 — Last heart lost mid-lesson:**
1. User answers wrong → `loseHeart()` called, effectiveHearts decremented to 0
2. FeedbackModal appears: "Incorrect!"
3. User clicks Continue → checks effectiveHearts = 0 → shows HeartsEmptyModal
4. HeartsEmptyModal blocks further play (non-dismissible)

**Case 2 — Starting lesson with 0 hearts:**
1. User on intro screen → useEffect detects `!hasHearts` → shows HeartsEmptyModal immediately (already works, line 68-71)

### Files to Change

| File | Change |
|---|---|
| `LessonScreen.tsx` | Add effectiveHeartsRef, remove premature modal trigger, add HeartsEmptyModal to exercise branch, fix stale hearts check in onContinue |

