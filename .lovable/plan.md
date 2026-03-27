

## Plan: Add Field Normalization to Track JSON Importer

### Problem
The JSON uses a database-export format with different field names than the schema expects:
- Units use `name`/`name_es` instead of `unit_title`/`unit_title_es`
- Lessons use `name`/`name_es` instead of `lesson_title`/`lesson_title_es`
- Exercises use `exercise_type` instead of `type`, and store exercise fields nested inside `question_data` instead of flat at the top level

### Fix

**File: `src/features/admin/learning/services/trackImportValidator.ts`**

Add a normalization step between unwrapping and schema validation that maps alternate field names to the expected ones:

```text
Parse JSON → Unwrap wrappers → Normalize fields → Validate schema
```

Normalization logic:
1. **Exercises**: Map `exercise_type` → `type`. Flatten `question_data` fields (question, options, pairs, etc.) to the top level of the exercise object so the schema can find them.
2. **Lessons**: Map `name` → `lesson_title`, `name_es` → `lesson_title_es`.
3. **Units**: Map `name` → `unit_title`, `name_es` → `unit_title_es`.

This is done with three small functions (`normalizeExercise`, `normalizeLesson`, `normalizeUnit`) applied recursively to the section payload before calling `TrackImportSchema.safeParse()`.

### Files to Change

| File | Change |
|---|---|
| `trackImportValidator.ts` | Add normalize functions and apply them to `sectionPayload` before validation |

No other files need changes — the downstream import logic in `ImportTrackJsonModal.tsx` already handles the validated output correctly.

