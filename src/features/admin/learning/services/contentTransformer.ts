import type { ImportUnit } from "../types/adminTypes";
import type { Json } from "@/integrations/supabase/types";

function normalizeMascot(mascot: string): string {
  const lower = mascot.toLowerCase();
  if (lower.includes("goat")) return "goat";
  return "caldi";
}

export function transformUnitForDb(
  unit: ImportUnit,
  sectionId: string,
  sortOrderStart: number,
) {
  const unitRow = {
    section_id: sectionId,
    name: unit.name,
    name_es: unit.name_es,
    description: unit.description,
    description_es: unit.description_es,
    icon: unit.icon,
    sort_order: sortOrderStart,
    estimated_minutes: unit.estimated_minutes,
    lesson_count: unit.lessons.length,
    is_active: true,
  };

  const lessons = unit.lessons.map((lesson, li) => {
    const avgDiff =
      lesson.exercises.reduce((s, e) => s + e.difficulty, 0) /
      lesson.exercises.length;
    const xpReward = Math.round(10 + (avgDiff / 100) * 10); // 10-20 range

    return {
      lessonRow: {
        name: lesson.name,
        name_es: lesson.name_es,
        intro_text: lesson.intro_text,
        intro_text_es: lesson.intro_text_es,
        sort_order: li,
        estimated_minutes: lesson.estimated_minutes,
        xp_reward: xpReward,
        exercise_count: lesson.exercises.length,
        is_active: true,
      },
      exercises: lesson.exercises.map((ex, ei) => ({
        exercise_type: ex.type,
        sort_order: ei,
        is_active: true,
        question_data: ex.question_data as Json,
        difficulty_score: ex.difficulty,
        concept_tags: ex.concept_tags,
        mascot: normalizeMascot(ex.mascot),
        mascot_mood: ex.mascot_mood,
      })),
    };
  });

  return { unitRow, lessons };
}
