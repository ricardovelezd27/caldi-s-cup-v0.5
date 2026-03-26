

## Plan: Track-Level JSON Importer with Exercise Format Transformer

### Problem
The existing `ImportUnitModal` expects a pre-normalized unit JSON with `question_data` already packed. The user's AI-generated JSON uses a flat, human-readable format at the section level (section → units → lessons → exercises) with exercise fields like `question`, `correct_answer`, `options` spread at the top level instead of nested inside `question_data`.

### Architecture

```text
User JSON (flat exercises)
       │
       ▼
 Zod Schema Validation (new TrackImportSchema)
       │
       ▼
 Exercise Format Transformer (flat → question_data JSONB)
       │
       ▼
 DB Upserts (section → units → lessons → exercises)
```

### File Changes

**1. `src/features/admin/learning/types/adminTypes.ts`** — Add new Zod schema
- Add `TrackImportExerciseSchema` that accepts the user's flat format (all fields like `question`, `question_es`, `correct_answer`, `options`, `pairs`, `steps`, `categories`, `items`, `variables`, `valid_combinations`, `images` as optional top-level fields)
- Add `TrackImportLessonSchema`, `TrackImportUnitSchema`, `TrackImportSchema` for the full hierarchy
- Add corresponding TypeScript types

**2. New: `src/features/admin/learning/services/exerciseFormatTransformer.ts`** — Core transformer
- Function `transformFlatExerciseToQuestionData(type, exercise)` that maps each exercise type's flat fields into the exact `question_data` shape each component expects:
  - `true_false` → `{ statement, statement_es, correct_answer, explanation, explanation_es }`
  - `multiple_choice` → `{ question, question_es, options: [{id, text, text_es}], correct_answer, explanation, explanation_es }`
  - `matching_pairs` → `{ instruction, instruction_es, pairs: [{id, left, left_es, right, right_es}], explanation, explanation_es }`
  - `sequencing` → `{ instruction, instruction_es, items: [{id, text, text_es}], correct_order, explanation, explanation_es }`
  - `categorization` → `{ instruction, instruction_es, categories, items, explanation, explanation_es }`
  - `prediction` → `{ scenario, scenario_es, question, question_es, options: [{id, text, text_es}], correct_answer, explanation, explanation_es }`
  - `comparison` → `{ question, question_es, item_a, item_b, correct_answer, explanation, explanation_es }`
  - `troubleshooting` → `{ scenario, scenario_es, question, question_es, options: [{id, text, text_es, is_correct}], explanation, explanation_es }`
  - `recipe_building` → `{ instruction, instruction_es, method, variables: [{id, name, name_es, type, options}], valid_combinations, explanation, explanation_es }`
  - `image_identification` → `{ instruction, instruction_es, options, correct_answer, explanation, explanation_es }`

**3. New: `src/features/admin/learning/components/ImportTrackJsonModal.tsx`** — New modal
- 3-step workflow: Paste → Preview → Done (same pattern as `ImportUnitModal`)
- Validates against `TrackImportSchema`
- Preview shows section info, units count, lessons count, exercises with type badges
- On publish:
  1. Find or create the section within the current track (match by `section_id` slug)
  2. For each unit: upsert unit, then for each lesson: upsert lesson + transform and upsert exercises
- Override mode: clears existing units in the matched section before importing
- File upload support: adds a file input button alongside the paste textarea

**4. `src/features/admin/learning/pages/TrackDetailPage.tsx`** — Add Import button
- Add "Import Track JSON" button next to "Export Track JSON"
- Wire up the new `ImportTrackJsonModal` with `trackId` prop
- The modal handles section creation internally

**5. `src/features/admin/learning/services/contentValidator.ts`** — Add track-level validator
- New `validateTrackImportJson(raw)` function using the new schema
- Same warning logic (exercise count, variety, difficulty) applied per lesson

**6. `src/features/admin/learning/services/adminLearningService.ts`** — Add section upsert
- New `upsertSection()` function to create/update sections within a track
- Needed for the track-level importer to auto-create sections

### Exercise Format Mapping (User JSON → DB question_data)

Example for `true_false`:
```text
User JSON:                          DB question_data:
{                                   {
  "question": "Coffee was...",        "statement": "Coffee was...",
  "question_es": "El café...",        "statement_es": "El café...",
  "correct_answer": true,             "correct_answer": true,
  "explanation": "Ethiopia...",       "explanation": "Ethiopia...",
  "explanation_es": "Etiopía..."      "explanation_es": "Etiopía..."
}                                   }
```

Example for `matching_pairs`:
```text
User JSON:                          DB question_data:
{                                   {
  "question": "Match the...",         "instruction": "Match the...",
  "pairs": [                          "instruction_es": "Empareja...",
    {"left":"Kaldi", ...}             "pairs": [
  ]                                     {"id":"pair_0","left":"Kaldi",...}
}                                     ],
                                      "explanation": "..."
                                    }
```

### Key Design Decisions
- The transformer is a pure function — easy to unit test
- Section matching uses a slug-based lookup (e.g., `history_and_culture` matches against existing sections by name similarity, or creates a new one)
- Mascot normalization reuses the existing `normalizeMascot` logic
- `mascot_feedback` / `mascot_feedback_es` from the user JSON are stored inside `question_data` as additional fields (harmless to components, useful for future mascot dialogue)

