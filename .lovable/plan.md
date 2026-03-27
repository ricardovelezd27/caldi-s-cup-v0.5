

## Plan: Fix Import JSON Deduplication, Add Move Lesson, Fix Unit Time

Three issues to address:

### 1. Import JSON: Merge Lessons into Existing Units (Instead of Creating Duplicates)

**Problem**: When importing a JSON with a unit name that already exists in the section, the importer creates a duplicate unit instead of appending lessons to the existing one.

**Fix in `ImportTrackJsonModal.tsx`**:
- In the preview step, after parsing, fetch existing units for the matched section
- For each unit in the JSON, check if a unit with the same name already exists (case-insensitive match)
- If a match is found, show a dropdown/select next to that unit in the preview letting the admin choose: "Create new unit" or "Merge into: [existing unit name]"
- Default to the matched existing unit when names match
- On publish: if merging, skip unit creation, use existing unit ID, append lessons with `sort_order` starting after the last existing lesson in that unit
- After publishing, update the existing unit's `lesson_count` and `estimated_minutes` to reflect the new totals

**New state**: `unitMappings: Record<number, string | "new">` — maps each JSON unit index to either an existing unit ID or "new"

### 2. Move Lesson to Another Unit

**Problem**: No way to move a lesson between units.

**Changes**:
- **`adminLearningService.ts`**: Add `moveLessonToUnit(lessonId, targetUnitId, newSortOrder)` — updates `learning_lessons.unit_id` and `sort_order`, then recalculates `lesson_count` and `estimated_minutes` on both the source and target units
- **`UnitDetailPage.tsx`**: Add a "Move" button (ArrowRightLeft icon) next to the delete button in each lesson row. Clicking opens a small dialog/select listing all units in the current track (grouped by section). On confirm, calls `moveLessonToUnit` and invalidates queries
- New component: **`MoveLessonDialog.tsx`** — a simple dialog with a Select dropdown of available units (excluding current), confirm button

### 3. Fix Unit `estimated_minutes` to Sum Lesson Times

**Problem**: Unit `estimated_minutes` is hardcoded to the JSON value (default 15) instead of being calculated from its lessons.

**Fix in `ImportTrackJsonModal.tsx`**:
- Replace `unit.estimated_minutes ?? 15` with the sum of all lesson `estimated_minutes` values: `unit.lessons.reduce((sum, l) => sum + (l.estimated_minutes ?? 4), 0)`
- This ensures the unit time reflects actual lesson content

**Fix in `TrackDetailPage.tsx`** (display):
- The `estimated_minutes` column already reads from DB, so fixing the import is sufficient. But for accuracy on existing data, also add a `recalculateUnitStats` service function that can be triggered manually or runs during import.

**`adminLearningService.ts`**: Add `recalculateUnitStats(unitId)` — queries all lessons for the unit, sums `estimated_minutes`, counts lessons, updates the unit row. Called after import and after move-lesson operations.

---

### Files to Change

| File | Change |
|---|---|
| `ImportTrackJsonModal.tsx` | Add unit-matching UI in preview step; merge logic on publish; fix time calculation |
| `UnitDetailPage.tsx` | Add "Move" button per lesson row, wire up MoveLessonDialog |
| `MoveLessonDialog.tsx` (new) | Dialog with unit selector for moving a lesson |
| `adminLearningService.ts` | Add `moveLessonToUnit()`, `recalculateUnitStats()`, `getAllUnitsForTrack()` |

