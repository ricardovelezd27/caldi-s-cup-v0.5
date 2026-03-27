

## Plan: Admin Exercise Preview + Immediate Reflect on Delete/Deactivate

### Overview
Add a live preview panel to the Exercise Editor dialog so admins can test-run any exercise exactly as students see it. Also ensure delete/deactivate operations immediately reflect in the published app.

### 1. Widen ExerciseEditor Dialog to Side-by-Side Layout

**File: `ExerciseEditor.tsx`**

- Change dialog `max-w-2xl` to `max-w-6xl`
- Split content into a two-column grid: left column = existing parameter form, right column = live preview
- The preview renders the same `ExerciseRenderer` component used by students, fed with the current `questionData` state (live-updating as admin edits)
- Map admin data to the `LearningExercise` shape expected by `ExerciseRenderer`:
  ```typescript
  const previewExercise: LearningExercise = {
    id: exercise.id,
    lessonId: "",
    exerciseType: exercise.exercise_type as ExerciseType,
    sortOrder: 0,
    isActive: active,
    questionData: questionData as Json,
    imageUrl: exercise.image_url ?? null,
    audioUrl: null,
    difficultyScore: difficulty,
    conceptTags: tags.split(",").map(t => t.trim()).filter(Boolean),
    mascot,
    mascotMood: mood,
    createdAt: "",
    updatedAt: "",
  };
  ```
- Wrap the preview in a phone-frame styled container (rounded border, fixed max-width ~375px, max-height ~667px with overflow scroll) to simulate mobile view
- The `ExerciseRenderer`'s `onAnswer` callback in preview mode will be a no-op (or show a toast "Preview: correct/incorrect") — no persistence
- Add a `key={JSON.stringify(questionData)}` on the preview to force re-mount when data changes, resetting internal exercise state
- Add footer buttons: Cancel, Save, (preview is always visible on right)

### 2. Immediate Reflect on Delete/Deactivate

**File: `LessonDetailPage.tsx`**

The `handleToggle` and `handleDelete` functions already call `qc.invalidateQueries`. The student-facing app fetches exercises with `is_active = true` filter. This should already work since both use the same Supabase backend.

- Verify that `toggleActive` in `adminLearningService.ts` actually updates the DB (it does — it's a direct update call)
- The invalidation only affects admin queries (`["admin", "exercises"]`). Student queries use different keys and will pick up changes on next fetch. This is correct — no additional changes needed since student data isn't cached in the admin app.

### Files to Change

| File | Change |
|---|---|
| `ExerciseEditor.tsx` | Widen dialog, add two-column layout with live preview panel using `ExerciseRenderer` |

### Technical Notes
- Reuses the exact same `ExerciseRenderer` component students see — zero divergence risk
- Preview updates live as admin edits question data fields
- No new dependencies or database changes needed

