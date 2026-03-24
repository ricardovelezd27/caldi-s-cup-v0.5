

# Plan: Add Query Limits + Guard Empty Exercise Data

## LEARN-002: Add `.limit()` to learning queries

All queries already have `.order("sort_order")`. Add `.limit(100)` to every list-fetching query to prevent unbounded result sets as content grows. The batch queries (`getUnitsBySectionIds`, `getLessonsByUnitIds`) get `.limit(500)` since they span multiple parents.

### `src/features/learning/services/learningService.ts`

| Function | Change |
|----------|--------|
| `getTracks` (line 128) | Add `.limit(100)` before `.order()` |
| `getSections` (line 140) | Add `.limit(100)` |
| `getUnits` (line 152) | Add `.limit(100)` |
| `getLessons` (line 164) | Add `.limit(100)` |
| `getExercises` (line 188) | Add `.limit(100)` |
| `getUnitsBySectionIds` (line 201) | Add `.limit(500)` |
| `getLessonsByUnitIds` (line 214) | Add `.limit(500)` |
| `getLeagues` (line 224) | Add `.limit(20)` (small fixed set) |

---

## LEARN-003: Guard empty/missing `questionData`

### `src/features/learning/components/lesson/ExerciseRenderer.tsx`

Add a guard after `const qd = exercise.questionData as any;` — if `qd` is null, undefined, or an empty object (`Object.keys(qd).length === 0`), render a fallback:

```tsx
if (!qd || typeof qd !== 'object' || Object.keys(qd).length === 0) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="rounded-lg border-4 border-dashed border-border p-8 bg-card/50 max-w-sm w-full">
        <p className="text-muted-foreground font-inter text-sm">
          This exercise is not available yet.
        </p>
      </div>
    </div>
  );
}
```

This runs before the `switch` so no exercise component receives empty data.

---

## Files Modified

| File | Change |
|------|--------|
| `learningService.ts` | Add `.limit()` to all 8 list queries |
| `ExerciseRenderer.tsx` | Add empty `questionData` guard with fallback UI |

