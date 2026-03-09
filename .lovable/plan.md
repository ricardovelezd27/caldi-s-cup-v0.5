

# Plan: Premium Tactile Quiz UI Overhaul

## Architecture Note

The project mandate specifies a **no-dependency architecture** for the learning module — avoiding external libraries like `framer-motion` to keep the bundle lean. All animations will use native CSS transitions and keyframe animations, consistent with the existing system.

## Changes

### 1. `LessonScreen.tsx` — Global Layout Wrapper
- Wrap exercise and feedback states in `min-h-[100dvh] flex flex-col` container
- Add `max-w-2xl mx-auto w-full` constraint to center content on desktop
- **Merge exercise + feedback into a single state render**: Instead of separate "exercise" and "feedback" screens, the exercise stays visible and the feedback bar slides up from the bottom (Duolingo-style)
- Remove the standalone `ExerciseFeedback` render block — feedback is now handled by the new bottom bar

### 2. `LessonProgress.tsx` — Thick Rounded Progress Bar
- Increase progress bar height from `h-3` to `h-4`
- Add `rounded-full` styling with custom colored indicator
- Remove the "X of Y" text counter (progress bar is self-explanatory, Duolingo doesn't show it)
- Constrain to `max-w-2xl mx-auto`

### 3. `ExerciseOption.tsx` — Tactile Answer Cards
- Remove letter index circles (A, B, C, D) — the card itself is the interactive element
- Change from `border-4` to `border-2 rounded-xl` for a cleaner card feel
- Add `active:scale-[0.97]` press effect and `transition-all duration-200`
- Selected state: `border-primary bg-primary/10 font-semibold`
- Correct state: `border-green-500 bg-green-50`
- Incorrect state: `border-destructive bg-destructive/5`
- Keep check/X icons for post-submit feedback

### 4. `MultipleChoice.tsx` — 2-Column Desktop Grid
- Change options container from `space-y-3` to `grid grid-cols-1 md:grid-cols-2 gap-3`
- Apply same pattern to other exercise types that use `ExerciseOption` (TrueFalse already has 2 options, works naturally)

### 5. `CheckButton.tsx` → New `BottomActionBar.tsx`
- **Replace** `CheckButton` with a new `BottomActionBar` component
- Fixed to screen bottom: `fixed bottom-0 left-0 right-0 z-50`
- Inner content constrained: `max-w-2xl mx-auto px-4 py-4`
- Three visual states driven by CSS transitions (`transition-all duration-300`):
  - **Default**: White/transparent background, standard "Check" button (primary color)
  - **Correct**: Green background (`bg-[hsl(142_76%_90%)]`), checkmark icon + "Continue" button, triggers `sounds.playCorrect()`
  - **Incorrect**: Red/accent background (`bg-accent/10`), shows explanation text + mascot dialogue, "Got it" button, triggers `sounds.playIncorrect()`
- Slides up with CSS `translate-y` animation using a keyframe (`animate-in slide-in-from-bottom`)
- The bar absorbs the functionality of both `CheckButton` and `ExerciseFeedback`

### 6. Exercise Components Integration
- `MultipleChoice`, `TrueFalse`, and other exercises that use `CheckButton` will switch to `BottomActionBar`
- Each exercise will expose its `isSubmitted` and `isCorrect` state so the bar can render the right variant
- Add `pb-24` padding to exercise content area to prevent the fixed bar from covering options

### 7. Sound Integration
- Move sound triggers from `ExerciseFeedback` (being removed) into the `BottomActionBar` correct/incorrect state transitions
- Remove duplicate sound calls from individual exercises (e.g., `MultipleChoice.handleCheck`)

## Files Changed

| File | Action |
|------|--------|
| `src/features/learning/components/exercises/base/BottomActionBar.tsx` | **Create** — new fixed bottom bar with 3 states |
| `src/features/learning/components/exercises/base/ExerciseOption.tsx` | **Edit** — tactile card redesign |
| `src/features/learning/components/exercises/base/CheckButton.tsx` | **Delete** or deprecate (replaced by BottomActionBar) |
| `src/features/learning/components/exercises/base/ExerciseFeedback.tsx` | **Delete** or deprecate (absorbed into BottomActionBar) |
| `src/features/learning/components/lesson/LessonScreen.tsx` | **Edit** — unified layout, merge exercise+feedback states |
| `src/features/learning/components/lesson/LessonProgress.tsx` | **Edit** — thicker bar, remove counter |
| `src/features/learning/components/exercises/knowledge/MultipleChoice.tsx` | **Edit** — 2-col grid, use BottomActionBar |
| `src/features/learning/components/exercises/knowledge/TrueFalse.tsx` | **Edit** — use BottomActionBar |
| Other exercise components using CheckButton | **Edit** — swap to BottomActionBar |

