

# Admin Dashboard (Cockpit) -- Learning Hub

## Summary

Build a global admin dashboard at `/admin` with a sidebar layout, starting with a fully functional "Learning Hub" for managing educational content. The dashboard uses the existing `RequireRole` guard and shadcn `Sidebar` component.

---

## Architecture Decisions

**Nested routing with `<Outlet>`.** The admin uses a layout route (`/admin`) with React Router's `<Outlet>` to render child pages inside a persistent sidebar shell. This avoids re-mounting the sidebar on navigation and follows standard SPA patterns.

**Admin services bypass `is_active` filter.** The existing `learningService.ts` filters by `is_active = true`. Admin needs to see ALL content (including inactive). A separate `adminLearningService.ts` will query without this filter. The existing admin RLS policies (`has_role(auth.uid(), 'admin')`) already grant full access to all learning tables.

**Client-side JSON staging.** The importer parses JSON into React state (not the database). The admin reviews/edits in a staging UI before explicitly publishing. No temporary tables or draft flags needed.

**No new database changes.** All learning tables already have admin-level RLS policies for full CRUD. The existing schema supports all required operations (update `question_data`, `is_active`, `mascot`, etc.).

---

## File Structure

```text
src/features/admin/
  layout/
    AdminLayout.tsx            -- Sidebar + Outlet shell
    AdminSidebar.tsx           -- Sidebar navigation items
  pages/
    AdminOverviewPage.tsx      -- Dashboard overview (placeholder stats)
    AdminComingSoonPage.tsx     -- "Coming Soon" for Scanner/Marketplace
  learning/
    pages/
      LearningHubPage.tsx      -- Top-level: track list
      TrackDetailPage.tsx      -- Sections + Units for a track
      UnitDetailPage.tsx       -- Lessons for a unit
      LessonDetailPage.tsx     -- Exercises for a lesson
    components/
      AdminBreadcrumb.tsx      -- Dynamic breadcrumb nav
      TrackList.tsx             -- Table of tracks with stats
      SectionCard.tsx           -- Section header with units
      UnitTable.tsx             -- Table of units in a section
      LessonTable.tsx           -- Table of lessons in a unit
      ExerciseList.tsx          -- List of exercises with inline edit
      ExerciseEditor.tsx        -- JSONB editor for question_data
      ImportUnitModal.tsx       -- JSON paste + staging preview
      StagedContentPreview.tsx  -- Visual preview of parsed content
      StagedExerciseCard.tsx    -- Single staged exercise preview
    hooks/
      useAdminTracks.ts         -- Fetch all tracks (no is_active filter)
      useAdminSections.ts       -- Fetch sections for a track
      useAdminUnits.ts          -- Fetch units for a section
      useAdminLessons.ts        -- Fetch lessons for a unit
      useAdminExercises.ts      -- Fetch exercises for a lesson
      useContentImporter.ts     -- JSON parse, validate, stage state
    services/
      adminLearningService.ts   -- CRUD without is_active filter + upserts
      contentTransformer.ts     -- Transform JSON to DB format
      contentValidator.ts       -- Zod validation for import JSON
    types/
      adminTypes.ts             -- Import JSON schema types
  index.ts                      -- Barrel export
```

---

## Routing

All admin routes are nested under `/admin` and wrapped in `RequireRole`:

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | `AdminOverviewPage` | Stats dashboard (index route) |
| `/admin/learning` | `LearningHubPage` | Track list |
| `/admin/learning/:trackId` | `TrackDetailPage` | Sections + units |
| `/admin/learning/:trackId/:unitId` | `UnitDetailPage` | Lessons list |
| `/admin/learning/:trackId/:unitId/:lessonId` | `LessonDetailPage` | Exercises |
| `/admin/scanner` | `AdminComingSoonPage` | Placeholder |
| `/admin/marketplace` | `AdminComingSoonPage` | Placeholder |

In `App.tsx`, this is a single lazy-loaded layout route:

```tsx
const AdminLayout = lazy(() => import("./features/admin/layout/AdminLayout"));
const LearningHubPage = lazy(() => import("./features/admin/learning/pages/LearningHubPage"));
// ...etc

<Route path="/admin" element={
  <Suspense fallback={null}>
    <RequireRole roles={["admin"]}>
      <AdminLayout />
    </RequireRole>
  </Suspense>
}>
  <Route index element={<AdminOverviewPage />} />
  <Route path="learning" element={<LearningHubPage />} />
  <Route path="learning/:trackId" element={<TrackDetailPage />} />
  <Route path="learning/:trackId/:unitId" element={<UnitDetailPage />} />
  <Route path="learning/:trackId/:unitId/:lessonId" element={<LessonDetailPage />} />
  <Route path="scanner" element={<AdminComingSoonPage title="Scanner Logs" />} />
  <Route path="marketplace" element={<AdminComingSoonPage title="Marketplace" />} />
</Route>
```

---

## Component Specifications

### AdminLayout

Uses `SidebarProvider` + shadcn `Sidebar` with `collapsible="icon"`. Contains a header with `SidebarTrigger` and the page title. Renders `<Outlet />` as the main content area.

### AdminSidebar

Navigation items:
- Overview (`/admin`) -- LayoutDashboard icon
- Learning Hub (`/admin/learning`) -- BookOpen icon
- Scanner Logs (`/admin/scanner`) -- ScanLine icon
- Marketplace (`/admin/marketplace`) -- Store icon

Uses `useLocation()` to highlight the active route. Items for Scanner/Marketplace are visually marked with a "Soon" badge.

### AdminBreadcrumb

Dynamically builds breadcrumb from route params and fetched entity names:
- Learning Hub > Track Name > Unit Name > Lesson Name
- Uses the shadcn `Breadcrumb` component (already installed)
- Each segment links back to its parent level

### TrackList (LearningHubPage)

Table showing all 4 tracks with columns: Icon, Name, Sections count, Total Lessons, Total Exercises, Status toggle. Clicking a row navigates to `/admin/learning/:trackId`.

### TrackDetailPage

Shows the track name + description at top. Below, sections are rendered as collapsible cards. Each section card contains a `UnitTable` listing its units with columns: Name, Lessons, Exercises, Time, Status. Each unit row has an "Import Unit JSON" button. Clicking a unit navigates to `/admin/learning/:trackId/:unitId`.

### UnitDetailPage

Shows unit name + description. `LessonTable` lists lessons with columns: Name, Exercises, XP, Time, Status. Clicking a lesson navigates to the lesson detail.

### LessonDetailPage

Shows lesson metadata (intro text, XP, exercise count). `ExerciseList` renders each exercise as a card showing: type badge, mascot + mood, difficulty score, question preview, and an "Edit" button. Clicking "Edit" opens `ExerciseEditor` inline or in a dialog.

### ExerciseEditor

A dialog/sheet for editing a single exercise:
- Dropdown for `exercise_type` (readonly display)
- `mascot` selector (caldi/goat radio)
- `mascot_mood` selector (dropdown)
- `difficulty_score` slider (1-100)
- `is_active` toggle
- `concept_tags` as comma-separated input
- `question_data` as a formatted JSON textarea with syntax highlighting (using a `<Textarea>` with monospace font + JSON.stringify pretty-print)
- Bilingual fields shown side by side (EN | ES)
- "Save" button calls `adminLearningService.updateExercise()`

### ImportUnitModal

Triggered from the "Import Unit JSON" button at the section/unit level.

**Step 1 -- Paste**: Large textarea for pasting the JSON payload. "Parse" button validates with Zod and transitions to Step 2.

**Step 2 -- Staging Preview**: Renders `StagedContentPreview` showing:
- Unit header (name EN/ES, description)
- For each lesson: lesson name, exercise count
  - For each exercise: type badge, question text preview, mascot, difficulty
  - Each field is editable inline
- Validation warnings shown as yellow badges (e.g., "First lesson avg difficulty > 50", "Less than 3 exercise types")

**Step 3 -- Publish**: "Publish to Database" button. Transforms staged data using `contentTransformer.ts`, upserts into the database via `adminLearningService`, shows success/error summary.

---

## Service Layer

### adminLearningService.ts

Mirrors `learningService.ts` but:
- Does NOT filter by `is_active`
- Includes mutation functions: `updateTrack()`, `updateSection()`, `updateUnit()`, `updateLesson()`, `updateExercise()`, `upsertUnit()`, `upsertLesson()`, `upsertExercise()`, `toggleActive()`
- All mutations use the Supabase client (admin RLS policies already allow full access)

### contentTransformer.ts

Transforms the AI-generated JSON format into database row format:
- Maps `mascot: "Caldi"` to `"caldi"`, `"The Goat"` to `"goat"`
- Builds `question_data` JSONB from the flat exercise fields (same logic as described in Phase 5 plan)
- Extracts concept tags from exercise text
- Calculates `xp_reward` from average difficulty
- Sets `exercise_count` and `lesson_count` denormalized fields

### contentValidator.ts

Zod schemas matching the AI content creator's JSON output format. Validates:
- Required fields (text, text_es, type, options, correct_answer)
- Type-specific validation (multiple_choice needs 3-5 options, fill_in_blank needs `{blank}` in text)
- Business rules (difficulty 1-100, at least 5 exercises per lesson)
- Returns `{ valid, errors, warnings }` where warnings are non-blocking

---

## Implementation Order

1. **Admin layout + routing**: `AdminLayout`, `AdminSidebar`, route registration in `App.tsx`, `AdminOverviewPage`, `AdminComingSoonPage`
2. **Admin services + hooks**: `adminLearningService.ts`, all `useAdmin*` hooks
3. **Learning Hub pages**: `LearningHubPage` (track list), `TrackDetailPage`, `UnitDetailPage`, `LessonDetailPage`
4. **Breadcrumb navigation**: `AdminBreadcrumb` wired into all learning pages
5. **Exercise editor**: `ExerciseEditor` dialog with JSONB editing
6. **JSON importer**: `contentValidator.ts`, `contentTransformer.ts`, `ImportUnitModal`, `StagedContentPreview`, `useContentImporter`

---

## Technical Notes

- No database migration needed. All admin RLS policies are already in place on every learning table.
- The `RequireRole` component handles auth + role checks. It prop takes `roles: AppRole[]`, so we pass `["admin"]`.
- All admin pages are lazy-loaded to avoid increasing the main bundle.
- The exercise editor saves `question_data` as raw JSONB. The admin is expected to maintain valid JSON structure. A "Preview Exercise" button could render the actual exercise component for visual verification (stretch goal).
- The import modal uses React state for staging -- no database writes until explicit "Publish" action.
- `ROUTES` constant updated with `admin: "/admin"`.

