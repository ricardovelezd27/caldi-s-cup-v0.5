import { supabase } from "@/integrations/supabase/client";
import type { LearningUserProgress, LearningUserExerciseHistory } from "../types";

function toProgress(row: any): LearningUserProgress {
  return {
    id: row.id,
    userId: row.user_id,
    lessonId: row.lesson_id,
    isCompleted: row.is_completed,
    completedAt: row.completed_at,
    scorePercent: row.score_percent,
    exercisesCorrect: row.exercises_correct,
    exercisesTotal: row.exercises_total,
    timeSpentSeconds: row.time_spent_seconds,
    xpEarned: row.xp_earned,
    attemptCount: row.attempt_count,
    bestScorePercent: row.best_score_percent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getUserProgress(userId: string): Promise<LearningUserProgress[]> {
  const { data, error } = await supabase
    .from("learning_user_progress")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return (data ?? []).map(toProgress);
}

export async function getLessonProgress(
  userId: string,
  lessonId: string,
): Promise<LearningUserProgress | null> {
  const { data, error } = await supabase
    .from("learning_user_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (error) throw error;
  return data ? toProgress(data) : null;
}

export async function upsertLessonProgress(progress: {
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  scorePercent: number;
  exercisesCorrect: number;
  exercisesTotal: number;
  timeSpentSeconds: number;
  xpEarned: number;
}): Promise<LearningUserProgress> {
  // Check for existing record to handle attempt_count and best_score
  const existing = await getLessonProgress(progress.userId, progress.lessonId);

  if (existing) {
    // Re-completion / review: increment attempt, keep best score, always refresh updated_at
    const { data, error } = await supabase
      .from("learning_user_progress")
      .update({
        is_completed: progress.isCompleted,
        completed_at: progress.isCompleted ? new Date().toISOString() : existing.completedAt,
        score_percent: progress.scorePercent,
        exercises_correct: progress.exercisesCorrect,
        exercises_total: progress.exercisesTotal,
        time_spent_seconds: progress.timeSpentSeconds,
        xp_earned: existing.xpEarned + progress.xpEarned,
        attempt_count: existing.attemptCount + 1,
        best_score_percent: Math.max(existing.bestScorePercent, progress.scorePercent),
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    return toProgress(data);
  }

  // First-time completion
  const { data, error } = await supabase
    .from("learning_user_progress")
    .insert({
      user_id: progress.userId,
      lesson_id: progress.lessonId,
      is_completed: progress.isCompleted,
      completed_at: progress.isCompleted ? new Date().toISOString() : null,
      score_percent: progress.scorePercent,
      exercises_correct: progress.exercisesCorrect,
      exercises_total: progress.exercisesTotal,
      time_spent_seconds: progress.timeSpentSeconds,
      xp_earned: progress.xpEarned,
      best_score_percent: progress.scorePercent,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return toProgress(data);
}

/**
 * Server-validated unlock check for a lesson.
 * Returns { unlocked, previousLessonId? }.
 * First lesson overall is always unlocked.
 * For anonymous users, checks localStorage.
 */
export async function isLessonUnlocked(
  userId: string | undefined,
  lessonId: string,
): Promise<{ unlocked: boolean; previousLessonId?: string }> {
  // 1. Fetch the target lesson's unit_id and sort_order
  const { data: lesson, error: lessonErr } = await supabase
    .from("learning_lessons")
    .select("id, unit_id, sort_order")
    .eq("id", lessonId)
    .maybeSingle();

  if (lessonErr || !lesson) return { unlocked: false };

  // 2. If sort_order > 0, the previous lesson is in the same unit
  if (lesson.sort_order > 0) {
    const { data: prevLesson } = await supabase
      .from("learning_lessons")
      .select("id")
      .eq("unit_id", lesson.unit_id)
      .eq("sort_order", lesson.sort_order - 1)
      .eq("is_active", true)
      .maybeSingle();

    if (!prevLesson) return { unlocked: true }; // no predecessor found, unlock

    const completed = userId
      ? await isLessonCompletedByUser(userId, prevLesson.id)
      : isLessonCompletedAnonymously(prevLesson.id);

    return completed
      ? { unlocked: true }
      : { unlocked: false, previousLessonId: prevLesson.id };
  }

  // 3. sort_order === 0 → first lesson in unit.
  //    Check if there's a previous unit in the same section whose last lesson is completed.
  const { data: unit } = await supabase
    .from("learning_units")
    .select("id, section_id, sort_order")
    .eq("id", lesson.unit_id)
    .maybeSingle();

  if (!unit) return { unlocked: true };

  if (unit.sort_order > 0) {
    // Find the previous unit in the same section
    const { data: prevUnit } = await supabase
      .from("learning_units")
      .select("id")
      .eq("section_id", unit.section_id)
      .eq("sort_order", unit.sort_order - 1)
      .eq("is_active", true)
      .maybeSingle();

    if (prevUnit) {
      // Find the last lesson in that previous unit
      const { data: lastLesson } = await supabase
        .from("learning_lessons")
        .select("id")
        .eq("unit_id", prevUnit.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastLesson) {
        const completed = userId
          ? await isLessonCompletedByUser(userId, lastLesson.id)
          : isLessonCompletedAnonymously(lastLesson.id);

        return completed
          ? { unlocked: true }
          : { unlocked: false, previousLessonId: lastLesson.id };
      }
    }
  }

  // 4. First unit in section → check section prerequisites
  const { data: section } = await supabase
    .from("learning_sections")
    .select("id, requires_section_id, sort_order")
    .eq("id", unit.section_id)
    .maybeSingle();

  if (!section || !section.requires_section_id) {
    // No prerequisite or first section → first lesson is always unlocked
    return { unlocked: true };
  }

  // Check if all lessons in the required section are completed
  const { data: reqSectionLessons } = await supabase
    .from("learning_lessons")
    .select("id, unit_id")
    .eq("is_active", true)
    .in(
      "unit_id",
      await getUnitIdsForSection(section.requires_section_id),
    );

  if (!reqSectionLessons || reqSectionLessons.length === 0) return { unlocked: true };

  for (const l of reqSectionLessons) {
    const completed = userId
      ? await isLessonCompletedByUser(userId, l.id)
      : isLessonCompletedAnonymously(l.id);
    if (!completed) return { unlocked: false };
  }

  return { unlocked: true };
}

async function getUnitIdsForSection(sectionId: string): Promise<string[]> {
  const { data } = await supabase
    .from("learning_units")
    .select("id")
    .eq("section_id", sectionId)
    .eq("is_active", true);
  return (data ?? []).map((u) => u.id);
}

async function isLessonCompletedByUser(userId: string, lessonId: string): Promise<boolean> {
  const { data } = await supabase
    .from("learning_user_progress")
    .select("id")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .eq("is_completed", true)
    .maybeSingle();
  return !!data;
}

function isLessonCompletedAnonymously(lessonId: string): boolean {
  try {
    const raw = localStorage.getItem("caldi_learning_progress");
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.lessonsCompleted) && parsed.lessonsCompleted.includes(lessonId);
  } catch {
    return false;
  }
}

export async function recordExerciseHistory(history: {
  userId: string;
  exerciseId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  userAnswer: any;
  wasReview?: boolean;
  lessonAttemptId?: string;
}): Promise<void> {
  const { error } = await supabase.from("learning_user_exercise_history").insert({
    user_id: history.userId,
    exercise_id: history.exerciseId,
    is_correct: history.isCorrect,
    time_spent_seconds: history.timeSpentSeconds,
    user_answer: history.userAnswer,
    was_review: history.wasReview ?? false,
    lesson_attempt_id: history.lessonAttemptId ?? null,
  });

  if (error) throw error;
}
