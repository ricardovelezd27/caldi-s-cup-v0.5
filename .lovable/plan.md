

# Add Delete Capabilities to Admin Learning Hub

## Summary
Add delete functions to the service layer and red trash-icon delete buttons with confirmation dialogs to all four admin pages (Tracks, Units, Lessons, Exercises).

## Changes

### 1. `adminLearningService.ts` -- Add delete function

Add one generic `deleteEntity` function (same pattern as `toggleActive`):

```typescript
export async function deleteEntity(
  table: "learning_tracks" | "learning_sections" | "learning_units" | "learning_lessons" | "learning_exercises",
  id: string,
) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}
```

Database cascading: The foreign keys between tracks→sections→units→lessons→exercises should handle nested deletion. If not, the RLS `ALL` policy for admins already covers DELETE.

### 2. UI changes -- All 4 pages

Each page gets:
- Import `AlertDialog` components from shadcn and `Trash2` from lucide-react
- A `deleteTarget` state (`string | null`) to track which entity ID is being confirmed
- A red icon button (Trash2) in each row, wrapped with `e.stopPropagation()` to prevent navigation
- An `AlertDialog` at page level that shows the warning and calls `deleteEntity` + invalidates queries on confirm

| Page | Entity | Table | Query keys to invalidate |
|------|--------|-------|-------------------------|
| `LearningHubPage` | Track | `learning_tracks` | `["admin", "tracks"]` |
| `TrackDetailPage` | Unit | `learning_units` | `["admin", "units-by-sections"]` |
| `UnitDetailPage` | Lesson | `learning_lessons` | `["admin", "lessons"]` |
| `LessonDetailPage` | Exercise | `learning_exercises` | `["admin", "exercises"]` |

### 3. AlertDialog pattern (shared across all pages)

```tsx
<AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete this item and all its nested content.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete} className="bg-destructive">
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

Delete button in each row:
```tsx
<Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); setDeleteTarget(id); }}>
  <Trash2 className="h-3 w-3" />
</Button>
```

### 4. Files modified

| File | Action |
|------|--------|
| `adminLearningService.ts` | Add `deleteEntity` |
| `LearningHubPage.tsx` | Add delete button + AlertDialog for tracks |
| `TrackDetailPage.tsx` | Add delete button + AlertDialog for units |
| `UnitDetailPage.tsx` | Add delete button + AlertDialog for lessons |
| `LessonDetailPage.tsx` | Add delete button + AlertDialog for exercises |

No database or migration changes needed -- admin RLS `ALL` policy already permits DELETE.

