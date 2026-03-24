

# Plan: Ensure All Learning Queries Filter Inactive Content

## Current State

All batch-query functions already filter by `is_active = true`:
- `getTracks()` ✅
- `getSections()` ✅  
- `getUnits()` ✅
- `getLessons()` ✅
- `getExercises()` ✅
- `getUnitsBySectionIds()` ✅
- `getLessonsByUnitIds()` ✅
- `getLeagues()` ✅ (no `is_active` column — not applicable)

## Gap Found

**`getLessonById()`** (line 148) has no `is_active` filter. A user could access a draft lesson by navigating directly to its URL.

## Change

### `src/features/learning/services/learningService.ts`

Add `.eq("is_active", true)` to `getLessonById()`:

```ts
const { data, error } = await supabase
  .from("learning_lessons")
  .select("*")
  .eq("id", lessonId)
  .eq("is_active", true)   // ← add this
  .maybeSingle();
```

| File | Change |
|------|--------|
| `learningService.ts` | Add `is_active` filter to `getLessonById()` |

