

# Phase 3: Exercise Templates

## Summary

Replace the placeholder `ExerciseRenderer` with 12 fully interactive exercise components, add supporting utilities (sounds, design tokens), and update the lesson flow to integrate proper exercise submission. No new dependencies will be added -- drag-and-drop interactions will use a lightweight tap-to-select/swap pattern instead of `@dnd-kit`, and animations will use CSS keyframes (already available in the project) instead of `framer-motion`, keeping the bundle lean.

---

## Architecture Decisions

**No new dependencies.** The prompt suggests `@dnd-kit` and `framer-motion`, but the project already has a rich animation system via Tailwind keyframes and CSS transitions. Adding two large libraries for exercises that can be handled with tap-to-select (mobile-first) and CSS animations keeps the bundle small and avoids dependency drift. If drag-and-drop becomes a hard requirement later, it can be added in a future iteration.

**Separation of concerns.** Each exercise component is a pure "dumb" component that receives `questionData`, manages its own local selection state, and calls `onSubmit(answer, isCorrect)` when the user taps Check. The parent (`ExerciseRenderer`) handles routing; the grandparent (`LessonScreen`) handles the state machine.

**Sound effects are opt-in.** The `SoundManager` uses the Web Audio API and only initializes an `AudioContext` on first user interaction (compliant with browser autoplay policies).

---

## Files Created (New)

| # | Path | Purpose |
|---|---|---|
| 1 | `src/features/learning/styles/exerciseTokens.ts` | Color, shadow, and timing constants for exercises |
| 2 | `src/features/learning/utils/sounds.ts` | Web Audio API sound manager (correct, incorrect, tap, celebration) |
| 3 | `src/features/learning/components/exercises/base/ExerciseOption.tsx` | Reusable selectable option button with states (default, selected, correct, incorrect, disabled) |
| 4 | `src/features/learning/components/exercises/base/CheckButton.tsx` | Sticky bottom check/continue button with 4 states |
| 5 | `src/features/learning/components/exercises/knowledge/MultipleChoice.tsx` | Select one from N options |
| 6 | `src/features/learning/components/exercises/knowledge/TrueFalse.tsx` | True or False with large square buttons |
| 7 | `src/features/learning/components/exercises/knowledge/FillInBlank.tsx` | Type answers into inline blanks |
| 8 | `src/features/learning/components/exercises/knowledge/MatchingPairs.tsx` | Tap-to-connect left-right pairs with SVG lines |
| 9 | `src/features/learning/components/exercises/knowledge/Sequencing.tsx` | Tap-to-swap reordering with numbered positions |
| 10 | `src/features/learning/components/exercises/knowledge/ImageIdentification.tsx` | Identify image from 2x2 option grid |
| 11 | `src/features/learning/components/exercises/knowledge/Categorization.tsx` | Tap items into category buckets |
| 12 | `src/features/learning/components/exercises/applied/Troubleshooting.tsx` | Diagnose a problem scenario (radio-style) |
| 13 | `src/features/learning/components/exercises/applied/RecipeBuilding.tsx` | Build valid recipe with dropdowns and sliders |
| 14 | `src/features/learning/components/exercises/applied/Calculation.tsx` | Solve brewing math with numeric input |
| 15 | `src/features/learning/components/exercises/applied/Prediction.tsx` | Predict outcome from scenario (single select) |
| 16 | `src/features/learning/components/exercises/applied/Comparison.tsx` | Compare two items, pick winner or equal |

## Files Modified (Existing)

| # | Path | Change |
|---|---|---|
| 1 | `src/features/learning/components/lesson/ExerciseRenderer.tsx` | Replace placeholder with switch routing to all 12 exercise components |
| 2 | `src/features/learning/components/exercises/base/ExerciseWrapper.tsx` | Enhance with timer counting up, sound integration, and improved layout |
| 3 | `src/features/learning/components/exercises/base/ExerciseFeedback.tsx` | Add slide-up animation and sound on correct/incorrect |
| 4 | `src/features/learning/components/lesson/LessonScreen.tsx` | Wire ExerciseWrapper + CheckButton into the exercise state; pass mascot data from exercise |
| 5 | `src/i18n/en.ts` | Add `learn.exercise.*` keys for all exercise-specific labels |
| 6 | `src/i18n/es.ts` | Add `learn.exercise.*` keys (Spanish translations) |

---

## Component Specifications

### Base Components

**ExerciseOption** -- Reusable button for MC, T/F, Troubleshooting, Prediction, Comparison answers:
- Props: `children`, `isSelected`, `isCorrect (null | boolean)`, `isDisabled`, `onClick`, `letterIndex?`
- Visual states: default (white/gray border), hover (shadow lift), selected (teal border + light teal bg), correct (green border + bg + checkmark icon), incorrect (red border + bg + X icon), disabled (opacity 50%)
- Plays `sounds.playTap()` on click
- Uses CSS `transition-all duration-150` for smooth state changes

**CheckButton** -- Sticky bottom bar:
- States: `disabled` (gray), `ready` (Energy Yellow), `continue` (green for correct / orange for incorrect)
- Full-width, 56px height, Bangers font, uppercase
- Sticker aesthetic (4px border, floating shadow)

### Knowledge Exercises

**MultipleChoice**: Renders question text + 4 `ExerciseOption` components in a vertical list. Single selection. On check, highlights correct green and selected-wrong red. Reads `questionData` as `{ question, question_es, options: [{id, text, text_es}], correct_answer, explanation, explanation_es }`.

**TrueFalse**: Two large square buttons side by side ("True" / "False" from i18n). Same submit flow. Reads `{ statement, statement_es, correct_answer: boolean, explanation, explanation_es }`.

**FillInBlank**: Parses question string for `{blank}` tokens, replaces them with inline `<input>` fields. Auto-focuses next blank. Validates all blanks case-insensitively against `correct_answers` arrays. Reads `{ question, question_es, blanks: [{id, correct_answers: string[]}], explanation }`.

**MatchingPairs**: Two columns (left items, shuffled right items). Tap left item to select (teal highlight), then tap right item to connect. SVG lines drawn between connected pairs. Tap a connected pair to disconnect. Check enabled when all pairs connected. Reads `{ instruction, pairs: [{id, left, right, left_es, right_es}], explanation }`.

**Sequencing**: Numbered list of items in random initial order. Tap an item to select it (teal highlight), tap another to swap positions. Number indicators update. Check compares order to `correct_order`. Reads `{ instruction, items: [{id, text, text_es}], correct_order: string[], explanation }`.

**ImageIdentification**: Large image at top (from `exercise.imageUrl` or `questionData.image_url`), 2x2 grid of `ExerciseOption` below. Same flow as MultipleChoice. Reads `{ instruction, options: [{id, text, text_es}], correct_answer, explanation }`.

**Categorization**: Category headers at top as bucket cards. Items pool at bottom. Tap an item to select it, then tap a category to place it there. Items stack inside category cards. Tap a placed item to return it to the pool. Check enabled when pool is empty. Reads `{ instruction, categories: [{id, name, name_es}], items: [{id, text, text_es, category_id}], explanation }`.

### Applied Exercises

**Troubleshooting**: Yellow-tinted scenario card at top, question below, radio-style `ExerciseOption` list. Some may have multiple correct (`is_correct` flag on each option). Reads `{ scenario, question, options: [{id, text, is_correct}], explanation }`.

**RecipeBuilding**: Method name header. Variables rendered as either `<Select>` dropdowns or `<Slider>` range inputs based on `type` field. Check validates against `valid_combinations` array. Reads `{ instruction, method, variables: [{id, name, type, options?, range?}], valid_combinations, explanation }`.

**Calculation**: Question text with formula context. Single numeric `<Input>` with unit label. Validates within `tolerance` (default +/-2). Optional hint toggle. Reads `{ question, correct_answer: number, tolerance?, unit?, hint?, explanation }`.

**Prediction**: Scenario card + question + vertical `ExerciseOption` list (often with directional icons). Identical flow to Troubleshooting but framed differently. Reads `{ scenario, question, options, correct_answer, explanation }`.

**Comparison**: Two item cards side by side with "VS" between. Optional images. Three `ExerciseOption` choices: Item A, Item B, "They're equal". Reads `{ question, item_a: {name, image_url?}, item_b: {name, image_url?}, attribute, correct_answer: 'a'|'b'|'equal', explanation }`.

---

## ExerciseRenderer Rewrite

The current placeholder will be replaced with a switch on `exercise.exerciseType`:

```text
switch (exercise.exerciseType):
  'multiple_choice'      -> <MultipleChoice data={qd} onSubmit={handleSubmit} disabled={disabled} />
  'true_false'           -> <TrueFalse ... />
  'fill_in_blank'        -> <FillInBlank ... />
  'matching_pairs'       -> <MatchingPairs ... />
  'sequencing'           -> <Sequencing ... />
  'image_identification' -> <ImageIdentification ... />
  'categorization'       -> <Categorization ... />
  'troubleshooting'      -> <Troubleshooting ... />
  'recipe_building'      -> <RecipeBuilding ... />
  'calculation'          -> <Calculation ... />
  'prediction'           -> <Prediction ... />
  'comparison'           -> <Comparison ... />
```

Each exercise component internally manages its own selection state and renders a `CheckButton`. When the user taps Check, the component validates the answer internally, calls `onSubmit(userAnswer, isCorrect)`, and plays the appropriate sound. The parent (`LessonScreen`) then transitions the state machine to `feedback`.

---

## LessonScreen Integration

The `LessonScreen` will be updated to:
1. Pass the exercise's `mascot` and `mascotMood` fields to `ExerciseFeedback` so the correct character reacts
2. Extract `explanation` / `explanation_es` from `questionData` and pass to `ExerciseFeedback`
3. Play `sounds.playCorrect()` or `sounds.playIncorrect()` on answer submission

---

## i18n Additions

New keys under `learn.exercise`:

- `selectOne`, `selectAll`, `matchPairs`, `orderItems`, `dragToCategory`, `fillBlanks`, `enterAnswer`
- `trueLabel`, `falseLabel`, `equalLabel`
- `niceWork`, `keepGoing`, `almostThere`
- `skip`, `perfectScore`, `tryAgain`
- `scenario`, `predict`, `compare`, `calculate`, `buildRecipe`, `diagnose`
- `showHint`, `hideHint`

All with Spanish equivalents.

---

## Implementation Order

1. **Utilities first**: `exerciseTokens.ts`, `sounds.ts`
2. **Base components**: `ExerciseOption.tsx`, `CheckButton.tsx`, update `ExerciseWrapper.tsx` and `ExerciseFeedback.tsx`
3. **Simple exercises**: `MultipleChoice`, `TrueFalse`, `FillInBlank`, `Calculation` (these are input-based, no complex interactions)
4. **Select-based exercises**: `Troubleshooting`, `Prediction`, `Comparison`, `ImageIdentification` (variants of MultipleChoice pattern)
5. **Interactive exercises**: `MatchingPairs`, `Sequencing`, `Categorization`, `RecipeBuilding` (tap-to-select interactions)
6. **Wire up**: Rewrite `ExerciseRenderer.tsx`, update `LessonScreen.tsx`
7. **i18n**: Add all new translation keys

---

## Technical Notes

- No `framer-motion` or `@dnd-kit` dependencies are added. All animations use existing Tailwind CSS keyframes (`animate-fade-in`, `animate-scale-in`) and CSS transitions. Drag interactions are replaced with tap-to-select/swap patterns that work better on mobile.
- The `SoundManager` lazily creates an `AudioContext` only on first user interaction, complying with browser autoplay policies.
- All exercise components use `useLanguage()` to resolve bilingual text, checking `language === 'es'` to pick `text_es` vs `text` fields from `questionData`.
- The `questionData` JSONB field is cast via `as ExerciseTypeData` within each component. TypeScript interfaces for each exercise's data shape are defined inline in each component file.
- SVG line drawing in `MatchingPairs` uses `useRef` on the container to calculate element positions and draws `<line>` elements with animated `stroke-dashoffset`.

