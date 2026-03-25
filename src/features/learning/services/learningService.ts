import { supabase } from "@/integrations/supabase/client";
import type {
  LearningTrack,
  LearningSection,
  LearningUnit,
  LearningLesson,
  LearningExercise,
  LearningLeague,
} from "../types";

// ── Row transformers ──

function toTrack(row: any): LearningTrack {
  return {
    id: row.id,
    trackId: row.track_id,
    name: row.name,
    nameEs: row.name_es,
    description: row.description,
    descriptionEs: row.description_es,
    icon: row.icon,
    colorHex: row.color_hex,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    isBonus: row.is_bonus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toSection(row: any): LearningSection {
  return {
    id: row.id,
    trackId: row.track_id,
    level: row.level,
    name: row.name,
    nameEs: row.name_es,
    description: row.description,
    descriptionEs: row.description_es,
    learningGoal: row.learning_goal,
    learningGoalEs: row.learning_goal_es,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    requiresSectionId: row.requires_section_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toUnit(row: any): LearningUnit {
  return {
    id: row.id,
    sectionId: row.section_id,
    name: row.name,
    nameEs: row.name_es,
    description: row.description,
    descriptionEs: row.description_es,
    icon: row.icon,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    tribeAffinity: row.tribe_affinity,
    estimatedMinutes: row.estimated_minutes,
    lessonCount: row.lesson_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toLesson(row: any): LearningLesson {
  return {
    id: row.id,
    unitId: row.unit_id,
    name: row.name,
    nameEs: row.name_es,
    introText: row.intro_text,
    introTextEs: row.intro_text_es,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    estimatedMinutes: row.estimated_minutes,
    xpReward: row.xp_reward,
    exerciseCount: row.exercise_count,
    featuredCoffeeId: row.featured_coffee_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toExercise(row: any): LearningExercise {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    exerciseType: row.exercise_type,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    questionData: row.question_data,
    imageUrl: row.image_url,
    audioUrl: row.audio_url,
    difficultyScore: row.difficulty_score,
    conceptTags: row.concept_tags ?? [],
    mascot: row.mascot,
    mascotMood: row.mascot_mood,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toLeague(row: any): LearningLeague {
  return {
    id: row.id,
    name: row.name,
    nameEs: row.name_es,
    tier: row.tier,
    icon: row.icon,
    colorHex: row.color_hex,
    promoteTopN: row.promote_top_n,
    demoteBottomN: row.demote_bottom_n,
    createdAt: row.created_at,
  };
}

// ── Service Functions ──

export async function getTracks(): Promise<LearningTrack[]> {
  const { data, error } = await supabase
    .from("learning_tracks")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
    .limit(100);

  if (error) throw error;
  return (data ?? []).map(toTrack);
}

export async function getSections(trackId: string): Promise<LearningSection[]> {
  const { data, error } = await supabase
    .from("learning_sections")
    .select("*")
    .eq("track_id", trackId)
    .eq("is_active", true)
    .order("sort_order")
    .limit(100);

  if (error) throw error;
  return (data ?? []).map(toSection);
}

export async function getUnits(sectionId: string): Promise<LearningUnit[]> {
  const { data, error } = await supabase
    .from("learning_units")
    .select("*")
    .eq("section_id", sectionId)
    .eq("is_active", true)
    .order("sort_order")
    .limit(100);

  if (error) throw error;
  return (data ?? []).map(toUnit);
}

export async function getLessons(unitId: string): Promise<LearningLesson[]> {
  const { data, error } = await supabase
    .from("learning_lessons")
    .select("*")
    .eq("unit_id", unitId)
    .eq("is_active", true)
    .order("sort_order")
    .limit(100);

  if (error) throw error;
  return (data ?? []).map(toLesson);
}

export async function getLessonById(lessonId: string): Promise<LearningLesson | null> {
  const { data, error } = await supabase
    .from("learning_lessons")
    .select("*")
    .eq("id", lessonId)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data ? toLesson(data) : null;
}

export async function getExercises(lessonId: string): Promise<LearningExercise[]> {
  const { data, error } = await supabase
    .from("learning_exercises")
    .select("*")
    .eq("lesson_id", lessonId)
    .eq("is_active", true)
    .order("sort_order")
    .limit(100);

  if (error) throw error;
  return (data ?? []).map(toExercise);
}

export async function getUnitsBySectionIds(sectionIds: string[]): Promise<LearningUnit[]> {
  if (sectionIds.length === 0) return [];
  const { data, error } = await supabase
    .from("learning_units")
    .select("*")
    .in("section_id", sectionIds)
    .eq("is_active", true)
    .order("sort_order")
    .limit(500);

  if (error) throw error;
  return (data ?? []).map(toUnit);
}

export async function getLessonsByUnitIds(unitIds: string[]): Promise<LearningLesson[]> {
  if (unitIds.length === 0) return [];
  const { data, error } = await supabase
    .from("learning_lessons")
    .select("*")
    .in("unit_id", unitIds)
    .eq("is_active", true)
    .order("sort_order")
    .limit(500);

  if (error) throw error;
  return (data ?? []).map(toLesson);
}

export async function getLeagues(): Promise<LearningLeague[]> {
  const { data, error } = await supabase
    .from("learning_leagues")
    .select("*")
    .order("tier")
    .limit(20);

  if (error) throw error;
  return (data ?? []).map(toLeague);
}

/**
 * Find the next lesson after the current one within the same track hierarchy.
 * Checks same unit first, then next unit in the same section.
 * Returns lesson ID or null if current lesson is the last.
 */
export async function getNextLessonInTrack(currentLessonId: string): Promise<string | null> {
  // 1. Get current lesson
  const { data: currentLesson, error: lessonErr } = await supabase
    .from("learning_lessons")
    .select("id, unit_id, sort_order")
    .eq("id", currentLessonId)
    .single();
  if (lessonErr || !currentLesson) return null;

  // 2. Try next lesson in the same unit
  const { data: nextInUnit } = await supabase
    .from("learning_lessons")
    .select("id")
    .eq("unit_id", currentLesson.unit_id)
    .eq("is_active", true)
    .gt("sort_order", currentLesson.sort_order)
    .order("sort_order")
    .limit(1)
    .maybeSingle();

  if (nextInUnit) return nextInUnit.id;

  // 3. Get current unit to find section context
  const { data: currentUnit } = await supabase
    .from("learning_units")
    .select("id, section_id, sort_order")
    .eq("id", currentLesson.unit_id)
    .single();
  if (!currentUnit) return null;

  // 4. Try first lesson of next unit in the same section
  const { data: nextUnit } = await supabase
    .from("learning_units")
    .select("id")
    .eq("section_id", currentUnit.section_id)
    .eq("is_active", true)
    .gt("sort_order", currentUnit.sort_order)
    .order("sort_order")
    .limit(1)
    .maybeSingle();

  if (!nextUnit) return null;

  const { data: firstLesson } = await supabase
    .from("learning_lessons")
    .select("id")
    .eq("unit_id", nextUnit.id)
    .eq("is_active", true)
    .order("sort_order")
    .limit(1)
    .maybeSingle();

  return firstLesson?.id ?? null;
}
