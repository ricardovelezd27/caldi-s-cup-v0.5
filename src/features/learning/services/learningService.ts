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
    .order("sort_order");

  if (error) throw error;
  return (data ?? []).map(toTrack);
}

export async function getSections(trackId: string): Promise<LearningSection[]> {
  const { data, error } = await supabase
    .from("learning_sections")
    .select("*")
    .eq("track_id", trackId)
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw error;
  return (data ?? []).map(toSection);
}

export async function getUnits(sectionId: string): Promise<LearningUnit[]> {
  const { data, error } = await supabase
    .from("learning_units")
    .select("*")
    .eq("section_id", sectionId)
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw error;
  return (data ?? []).map(toUnit);
}

export async function getLessons(unitId: string): Promise<LearningLesson[]> {
  const { data, error } = await supabase
    .from("learning_lessons")
    .select("*")
    .eq("unit_id", unitId)
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw error;
  return (data ?? []).map(toLesson);
}

export async function getLessonById(lessonId: string): Promise<LearningLesson | null> {
  const { data, error } = await supabase
    .from("learning_lessons")
    .select("*")
    .eq("id", lessonId)
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
    .order("sort_order");

  if (error) throw error;
  return (data ?? []).map(toExercise);
}

export async function getLeagues(): Promise<LearningLeague[]> {
  const { data, error } = await supabase
    .from("learning_leagues")
    .select("*")
    .order("tier");

  if (error) throw error;
  return (data ?? []).map(toLeague);
}
