

## Plan: Block Lesson Start When Hearts Are Empty

### Problem
Users with 0 hearts can currently enter a lesson and see the intro screen. They should instead be shown the "Out of Hearts" modal immediately, preventing them from starting.

### Change

**Single file: `LessonScreen.tsx`**

In the `intro` state render block (around line 248), before rendering `LessonIntro`, check if the user is logged in and `hasHearts` is false. If so, show the `HeartsEmptyModal` instead of (or on top of) the intro screen.

Specifically:
- When `lesson.state === "intro"` and `user` exists and `!hasHearts` (and hearts aren't still loading), auto-set `showHeartsEmpty = true`
- Add a `useEffect` that watches `lesson.state`, `hasHearts`, and `user` — when all conditions met, opens the modal
- The `HeartsEmptyModal` is already imported and rendered in the exercise block; move it to render unconditionally (outside any state block) so it works from the intro screen too
- The modal is already non-dismissible with navigation buttons ("Go to Learn Home", "Go to Profile"), so the UX is already correct

### Minimal diff
1. Add a `useEffect` after existing state declarations:
```typescript
useEffect(() => {
  if (lesson.state === "intro" && user && !hasHearts && !heartsLoading) {
    setShowHeartsEmpty(true);
  }
}, [lesson.state, hasHearts, user, heartsLoading]);
```

2. Move the `<HeartsEmptyModal>` render from inside the exercise block to the bottom of the component (before the final closing tags), so it renders regardless of lesson state.

No new files needed. No schema changes.

