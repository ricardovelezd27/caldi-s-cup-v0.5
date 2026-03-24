

## Plan: Harden Lesson Completion Pipeline

### Problem
`handleLessonDone` in `LessonScreen.tsx` has a single try/catch around multiple async operations — one failure blocks everything. No double-click guard exists, so rapid taps can award XP twice. `addXPToDaily` in `streakService.ts` hardcodes `is_achieved: xp >= 10` instead of using the user's actual daily goal.

### Changes

#### 1. `src/features/learning/components/lesson/LessonScreen.tsx`

- Add `import { useRef } from "react"` and `import { toast } from "sonner"`
- Add `const hasSubmittedRef = useRef(false)` inside the component
- At top of `handleLessonDone`: early-return if `hasSubmittedRef.current` is true, then set it to true
- Break the single try/catch into individually-wrapped operations:
  - **Streak RPC** (critical): toast error on fail, continue
  - **Daily goal + league XP**: catch individually, log, continue
  - **Profile XP update**: catch, log, continue
  - **Progress upsert** (critical): toast warning on fail
  - **Achievements**: catch, continue, call `onComplete()` anyway
- Reset `hasSubmittedRef.current = false` in the finally block

#### 2. `src/services/gamification/streakService.ts`

- In `addXPToDaily()`, when inserting a new row (no existing goal), fetch the user's most recent `goal_xp` from `learning_user_daily_goals` to use as the threshold instead of hardcoded `10`:
  ```
  const { data: lastGoal } = await supabase
    .from("learning_user_daily_goals")
    .select("goal_xp")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(1)
    .maybeSingle();
  const threshold = lastGoal?.goal_xp ?? 10;
  ```
- Use `threshold` in `is_achieved: xp >= threshold`

### Files to modify
- `src/features/learning/components/lesson/LessonScreen.tsx`
- `src/services/gamification/streakService.ts`

