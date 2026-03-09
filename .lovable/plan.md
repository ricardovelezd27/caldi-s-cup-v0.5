

# Plan: Remove Calculation + Expand Admin Exercise Forms

Two tasks: (A) fully purge `calculation` from the platform, and (B) add dedicated admin forms for `prediction`, `troubleshooting`, `categorization`.

---

## A. Remove Calculation Completely

### 1. Delete files
- `src/features/learning/components/exercises/applied/Calculation.tsx`
- `src/features/learning/components/exercises/applied/Calculation.test.tsx`

### 2. ExerciseRenderer.tsx
Already clean -- no calculation references remain from the previous change.

### 3. Types
`learning.ts` already has calculation removed from `ExerciseType`. The auto-generated `types.ts` still has it in the DB enum -- that requires a DB migration (step 5).

### 4. Admin validation
`contentValidator.ts` already warns on calculation -- no further change needed.

### 5. Database migration
Remove the enum value and delete existing calculation exercises:

```sql
-- Delete any calculation exercises
DELETE FROM learning_exercises WHERE exercise_type = 'calculation';

-- Remove 'calculation' from the exercise_type enum
ALTER TYPE learning_exercise_type RENAME TO learning_exercise_type_old;
CREATE TYPE learning_exercise_type AS ENUM (
  'multiple_choice','fill_in_blank','true_false',
  'matching_pairs','sequencing','image_identification',
  'categorization','troubleshooting','recipe_building',
  'prediction','comparison'
);
ALTER TABLE learning_exercises
  ALTER COLUMN exercise_type TYPE learning_exercise_type
  USING exercise_type::text::learning_exercise_type;
DROP TYPE learning_exercise_type_old;
```

---

## B. New Admin Sub-Forms

The existing forms (`TrueFalseForm`, `MultipleChoiceForm`, `FillInBlankForm`, `MatchingPairsForm`, `SequencingForm`) are already built and wired in the `ExerciseEditor` switch. The remaining types that still fall through to `GenericJsonForm` are: `prediction`, `troubleshooting`, `categorization`, `image_identification`, `comparison`, `recipe_building`.

This plan covers the three requested: **prediction**, **troubleshooting**, and **categorization**.

### New files to create

**`exercise-forms/PredictionForm.tsx`**
- Mirrors `MultipleChoiceForm` structure but adds Scenario (EN/ES) fields above the question.
- Schema: `{ scenario, scenario_es, question, question_es, options[]{id, text, text_es}, correct_answer, explanation, explanation_es }`
- Dynamic options list with radio to select `correct_answer`.

**`exercise-forms/TroubleshootingForm.tsx`**
- Similar to Prediction but options have `is_correct: boolean` on each option instead of a global `correct_answer`.
- Renders a Switch/checkbox per option row to mark it as correct.
- Fields: `scenario`, `scenario_es`, `question`, `question_es`, `options[]{id, text, text_es, is_correct}`, `explanation`, `explanation_es`.

**`exercise-forms/CategorizationForm.tsx`**
- Instruction (EN/ES) inputs.
- Dynamic "Categories" list: each has `id`, `name`, `name_es`. Add/remove buttons.
- Dynamic "Items" list: each has `id`, `text`, `text_es`, and a `Select` dropdown to assign `category_id` from the categories list.
- Explanation (EN/ES).

### Files to modify

**`exercise-forms/index.ts`** -- Add 3 new exports.

**`ExerciseEditor.tsx`** -- Add 3 cases to the switch:
```
case "prediction": return <PredictionForm ... />;
case "troubleshooting": return <TroubleshootingForm ... />;
case "categorization": return <CategorizationForm ... />;
```

All forms follow the existing pattern: `Props { data: Record<string, any>, onChange: (data) => void }` with a `toTyped()` helper and an `update()` partial-merge function.

---

## Summary of changes

| File | Action |
|------|--------|
| `Calculation.tsx` | Delete |
| `Calculation.test.tsx` | Delete |
| `exercise-forms/PredictionForm.tsx` | Create |
| `exercise-forms/TroubleshootingForm.tsx` | Create |
| `exercise-forms/CategorizationForm.tsx` | Create |
| `exercise-forms/index.ts` | Add 3 exports |
| `ExerciseEditor.tsx` | Add 3 switch cases |
| DB migration | Remove `calculation` enum value + delete rows |

