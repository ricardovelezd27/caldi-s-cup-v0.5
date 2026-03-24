

# Plan: Add Error Boundary Around Lesson Exercises

## Problem

If a single exercise component throws a runtime error (e.g., malformed `questionData`), the entire lesson page crashes. Users lose progress and see a generic error screen.

## Changes

### `src/features/learning/components/lesson/LessonScreen.tsx`

1. **Import** `ErrorBoundary` from `@/components/error/ErrorBoundary`
2. **Create** an `ExerciseFallback` inline component that shows a friendly message and a "Skip to Next" button calling `lesson.nextExercise()`
3. **Wrap** the `<ExerciseRenderer>` (around line 210) with `<ErrorBoundary>`, passing the fallback and using `key={lesson.currentExercise.id}` so the boundary resets per exercise

```tsx
const ExerciseFallback = () => (
  <div className="flex flex-col items-center justify-center py-8 px-4 text-center max-w-sm mx-auto">
    <div className="rounded-lg border-4 border-dashed border-border p-8 bg-card/50 w-full space-y-4">
      <p className="text-muted-foreground font-inter text-sm">
        This exercise had a problem loading. Your progress has been saved — you can continue to the next exercise.
      </p>
      <Button variant="default" onClick={() => lesson.nextExercise()}>
        Skip to Next
      </Button>
    </div>
  </div>
);
```

Wrap usage:
```tsx
<ErrorBoundary
  key={lesson.currentExercise.id}
  name="ExerciseRenderer"
  fallback={<ExerciseFallback />}
>
  <ExerciseRenderer ... />
</ErrorBoundary>
```

## Files Modified

| File | Change |
|------|--------|
| `LessonScreen.tsx` | Import ErrorBoundary, add fallback component, wrap ExerciseRenderer |

