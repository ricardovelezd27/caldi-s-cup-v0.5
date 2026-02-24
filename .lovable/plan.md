

# Phase 5: Content Population and Track Navigation Fix

## Summary

This phase has two parts: (1) seed the Brewing Science track with actual learning content via SQL, and (2) fix the TrackPathView so users can navigate from Track -> Section -> Unit -> Lesson. Currently the TrackPathView renders sections but always shows "Coming soon" because it never fetches units or lessons.

---

## Part 1: Seed Content via SQL Migration

Rather than building a complex JSON import pipeline with transformers, validators, and UUID generators (which adds significant code surface for a one-time operation), we seed the MVP content directly via a SQL migration. This follows the plan's own "Option A: Direct Database Seeding" recommendation and avoids adding `uuid-v5` as a dependency.

The migration will insert:

**Brewing Science -> Section 1: Extraction Fundamentals**

| Unit | Lessons | Exercises |
|------|---------|-----------|
| U1.1: The Alchemy of the Bean | 3 lessons | ~18 exercises |
| U1.2: The Extraction Timeline | 3 lessons | ~18 exercises |
| U1.3: Under vs Over Extraction | 3 lessons | ~18 exercises |
| U1.4: The Balanced Cup | 3 lessons | ~18 exercises |

**Total: 1 section, 4 units, 12 lessons, ~72 exercises**

Each lesson will have 6 exercises covering a mix of types (true_false, multiple_choice, fill_in_blank, matching_pairs, calculation, prediction, sequencing, categorization, troubleshooting, comparison).

All exercise data is embedded as JSONB `question_data` with both English and Spanish translations.

The migration will use CTEs to chain inserts and reference parent IDs cleanly.

---

## Part 2: Fix TrackPathView to Load and Display Content

Currently `useTrackPath` builds sections with `units: []` and `TrackPathView` shows "Coming soon" for every section. We need to:

### File: `src/features/learning/hooks/useTrackPath.ts`
- After fetching sections, fetch ALL units for those sections in a single query (using `section_id.in.(...)`)
- After fetching units, fetch ALL lessons for those units in a single query
- Build the nested structure: Section -> Units -> Lessons
- Assign lesson status: "completed" (in progressMap), "available" (first uncompleted or all if no prereqs), "locked" (after first uncompleted)
- Calculate `overallPercent` as `(completedLessons / totalLessons) * 100`

### File: `src/features/learning/components/track/TrackPathView.tsx`
- Replace the "Coming soon" placeholder with actual unit/lesson rendering
- For each section, show its units
- For each unit, show a vertical list of lesson nodes (circle + name)
- Completed lessons: green circle with checkmark
- Available lessons: teal pulsing circle, clickable (links to `/learn/:trackId/:lessonId`)
- Locked lessons: gray circle with lock icon, not clickable
- Connect lessons with a vertical line (path visualization)

### File: `src/features/learning/services/learningService.ts`
- Add `getUnitsBySectionIds(sectionIds: string[])` -- fetches all units for multiple sections in one query
- Add `getLessonsByUnitIds(unitIds: string[])` -- fetches all lessons for multiple units in one query
- These batch queries prevent N+1 problems when a track has many sections/units

---

## Implementation Order

1. **Database migration**: Seed Section 1 content (4 units, 12 lessons, ~72 exercises)
2. **Service layer**: Add batch query functions to `learningService.ts`
3. **Hook update**: Rewrite `useTrackPath.ts` to fetch and nest units/lessons
4. **UI update**: Rewrite `TrackPathView.tsx` to render the lesson path with status indicators

---

## Technical Notes

- The Brewing Science track UUID is `3d46062b-fe55-4764-97f2-bbf130771b08` (confirmed from database)
- All content tables have RLS policies allowing anyone to SELECT active rows, so no policy changes needed
- Exercise `question_data` follows the exact JSONB schemas that the existing exercise components (`MultipleChoice`, `TrueFalse`, `FillInBlank`, etc.) expect
- The migration uses `gen_random_uuid()` for all IDs since deterministic UUIDs add complexity with no benefit for seed data
- Lesson `xp_reward` ranges from 10-20 based on difficulty; `exercise_count` is set to match actual exercise count
- The `lesson_count` on units is set to match actual lesson count
- No new dependencies are required
- The admin content panel from the prompt is deferred -- it adds ~4 components for a workflow that can be handled via SQL for now. It can be added when content authoring scales beyond direct seeding.

---

## Content Sample (Exercise JSONB Structures)

Each exercise type follows the exact format the existing components parse:

**true_false**: `{ "statement": "...", "statement_es": "...", "correct_answer": true/false, "explanation": "...", "explanation_es": "..." }`

**multiple_choice**: `{ "question": "...", "question_es": "...", "options": [{"id": "a", "text": "...", "text_es": "..."}], "correct_answer": "b", "explanation": "...", "explanation_es": "..." }`

**fill_in_blank**: `{ "question": "... {blank} ...", "question_es": "...", "blanks": [{"id": 1, "correct_answers": ["22"]}], "explanation": "..." }`

**matching_pairs**: `{ "instruction": "...", "instruction_es": "...", "pairs": [{"id": "1", "left": "...", "right": "..."}], "explanation": "..." }`

**calculation**: `{ "question": "...", "question_es": "...", "correct_answer": 352, "tolerance": 2, "unit": "ml", "explanation": "..." }`

**prediction**: `{ "scenario": "...", "scenario_es": "...", "question": "...", "options": [{"id": "up", "text": "Increases"}], "correct_answer": "up", "explanation": "..." }`

**sequencing**: `{ "instruction": "...", "items": [{"id": "1", "text": "..."}], "correct_order": ["1","3","2","4"], "explanation": "..." }`

**troubleshooting**: `{ "scenario": "...", "question": "...", "options": [{"id": "a", "text": "...", "is_correct": true}], "explanation": "..." }`

