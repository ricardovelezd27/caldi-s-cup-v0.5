import { z } from "zod";

// ── JSON Import Schema (matches AI Content Creator output) ──

export const ImportExerciseSchema = z.object({
  type: z.string(),
  mascot: z.string().default("Caldi"),
  mascot_mood: z.string().default("neutral"),
  difficulty: z.number().min(1).max(100).default(50),
  concept_tags: z.array(z.string()).default([]),
  question_data: z.record(z.unknown()),
});

export const ImportLessonSchema = z.object({
  name: z.string().min(1),
  name_es: z.string().min(1),
  intro_text: z.string().default(""),
  intro_text_es: z.string().default(""),
  estimated_minutes: z.number().default(4),
  exercises: z.array(ImportExerciseSchema).min(1),
});

export const ImportUnitSchema = z.object({
  name: z.string().min(1),
  name_es: z.string().min(1),
  description: z.string().default(""),
  description_es: z.string().default(""),
  icon: z.string().default("📖"),
  estimated_minutes: z.number().default(15),
  lessons: z.array(ImportLessonSchema).min(1),
});

export type ImportExercise = z.infer<typeof ImportExerciseSchema>;
export type ImportLesson = z.infer<typeof ImportLessonSchema>;
export type ImportUnit = z.infer<typeof ImportUnitSchema>;

// ── Validation result ──

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  data?: ImportUnit;
}
