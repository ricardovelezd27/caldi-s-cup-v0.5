
# Phase 1: Caldi Learning Module -- Database Foundation

## Summary

Create the full database schema for a Duolingo-style coffee learning system, along with TypeScript types and a basic data service. No UI components in this phase.

## What Gets Built

- 13 new database tables for content hierarchy, user progress, and gamification
- 3 new enums (`learning_track_id`, `learning_level`, `exercise_type`)
- RLS policies on every table
- Seed data for 4 tracks, 7 leagues, and 8 achievements
- TypeScript types file at `src/features/learning/types/learning.ts`
- Service file at `src/features/learning/services/learningService.ts`

## Database Migration

A single migration will be run containing:

### 1. Enums

Three new enums: `learning_track_id` (4 tracks), `learning_level` (5 tiers), `exercise_type` (12 types).

### 2. Content Tables (public read, admin write)

| Table | Purpose | Key columns |
|---|---|---|
| `learning_tracks` | 4 main paths | track_id (enum, unique), bilingual name/desc, icon, color, is_bonus |
| `learning_sections` | Difficulty divisions within tracks | FK to tracks, level enum, requires_section_id for gating |
| `learning_units` | Topic groups within sections | FK to sections, tribe_affinity (nullable, uses existing coffee_tribe enum) |
| `learning_lessons` | Individual 3-5 min sessions | FK to units, xp_reward, featured_coffee_id FK to coffees |
| `learning_exercises` | Questions/activities | FK to lessons, exercise_type enum, question_data JSONB, concept_tags for spaced repetition |

### 3. User Progress Tables (user-scoped RLS)

| Table | Purpose |
|---|---|
| `learning_user_progress` | Completion per lesson, scores, XP, attempts. UNIQUE(user_id, lesson_id) |
| `learning_user_exercise_history` | Per-exercise attempt log for spaced repetition |

### 4. Gamification Tables

| Table | Purpose |
|---|---|
| `learning_user_streaks` | Current/longest streak, total XP, freeze logic. UNIQUE on user_id |
| `learning_leagues` | 7-tier league definitions |
| `learning_user_league` | User's current league + weekly XP. UNIQUE on user_id |
| `learning_achievements` | Badge definitions (code unique) |
| `learning_user_achievements` | Earned badges. UNIQUE(user_id, achievement_id) |
| `learning_user_daily_goals` | Daily XP targets. UNIQUE(user_id, date) |

### 5. RLS Policy Strategy

- **Content tables** (tracks, sections, units, lessons, exercises): `SELECT` allowed for all authenticated users where `is_active = true`. Admin full access via `has_role()`.
- **User progress/history/streaks/goals/achievements**: `SELECT`, `INSERT`, `UPDATE` restricted to `user_id = auth.uid()`. No `DELETE` on progress tables.
- **Leagues table**: Public `SELECT` for leaderboard. Admin full access.
- **User league**: Own data for read/write. Public `SELECT` on `weekly_xp` and `league_id` for leaderboard views.

### 6. Indexes

Performance indexes on all FK columns and common query patterns (user_id, lesson_id, exercise_id, week_start_date + weekly_xp DESC).

### 7. Triggers

Attach existing `update_updated_at_column()` trigger to all tables with `updated_at`.

### 8. Seed Data

Insert 4 tracks, 7 leagues, and 8 base achievements (streak milestones + lesson completion milestones) with bilingual names.

## Frontend Files Created

### `src/features/learning/types/learning.ts`

TypeScript interfaces mirroring every database table, plus union types for the enums. Will follow the same pattern as `src/features/coffee/types/coffee.ts`.

### `src/features/learning/services/learningService.ts`

Read-only service functions following the pattern in `coffeeService.ts`:
- `getTracks()` -- fetch all active tracks
- `getSections(trackId)` -- fetch sections for a track
- `getUnits(sectionId)` -- fetch units for a section
- `getLessons(unitId)` -- fetch lessons for a unit
- `getExercises(lessonId)` -- fetch exercises for a lesson
- `getLeagues()` -- fetch league tiers

### `src/features/learning/types/index.ts` and `src/features/learning/services/index.ts`

Barrel exports following existing conventions.

## Technical Notes

- No FK reference to `auth.users` directly; user_id columns are plain UUID with RLS enforcement
- The `learning_lessons.featured_coffee_id` FK to `coffees` connects learning content to real catalog entries
- `learning_units.tribe_affinity` reuses the existing `coffee_tribe` enum for personalization
- All JSONB columns (`question_data`, `user_answer`) are typed as `Json` from the Supabase types
- The migration is idempotent-safe with `IF NOT EXISTS` on enum creation
