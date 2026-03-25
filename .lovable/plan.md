

## Plan: Fix Broken "Next Lesson" Navigation

### Problem
`handleNextLesson` navigates to `/learn/${trackId}/lesson/${nextLessonId}` but the route is `/learn/:trackId/:lessonId`. The extra `/lesson/` segment causes a 404.

### Fix

**`src/features/learning/components/lesson/LessonScreen.tsx`** — Line 200

Change:
```ts
navigate(`/learn/${trackId}/lesson/${nextLessonId}`);
```
To:
```ts
navigate(`/learn/${trackId}/${nextLessonId}`);
```

One-line fix. No other files affected.

