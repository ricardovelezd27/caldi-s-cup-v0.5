

# Plan: Skill Decay for Spaced Repetition (Phase 3)

## Overview
Add a "decayed" status for completed lessons older than 14 days to encourage review. Decayed lessons still count as completed for progress/unlocking.

## Changes

### 1. Update `useTrackPath.ts`

**Type Update (line 16)**:
```typescript
status: "completed" | "available" | "locked" | "decayed"
```

**Logic Changes**:
- Add constant `DECAY_THRESHOLD_DAYS = 14`
- Create a Map from progress data: `lessonId -> progress record` (to access timestamps)
- When processing completed lessons:
  - Get `updatedAt` (or fall back to `completedAt`) from progress
  - Calculate days since using `date-fns` differenceInDays
  - If `daysSinceUpdate >= 14`, set status to `"decayed"` instead of `"completed"`
- Decayed lessons still increment `completedCount` and don't reset `foundFirstAvailable`

**Technical Detail**: The progress service already returns `updatedAt` timestamps, so no service changes needed.

### 2. Files Modified

| File | Change |
|------|--------|
| `src/features/learning/hooks/useTrackPath.ts` | Add `decayed` status type + decay calculation logic |

No database changes. `date-fns` already installed.

---

**Note**: The `TrackPathView.tsx` component will need a follow-up update to render the "decayed" visual state (orange/amber styling, review icon). That can be a separate task after this logic is in place.

