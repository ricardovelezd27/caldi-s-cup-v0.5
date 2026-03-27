import { z } from "zod";

// ── Track Import Schemas (flat AI-generated format) ──

const TrackImportExerciseSchema = z.object({
  exercise_id: z.string().optional(),
  type: z.string(),
  difficulty_score: z.number().min(1).max(100).default(50),
  mascot: z.string().default("Caldi"),
  mascot_mood: z.string().default("neutral"),
  concept_tags: z.array(z.string()).optional(),
  // All exercise-specific fields are optional at top level
  question: z.string().optional(),
  question_es: z.string().optional(),
  correct_answer: z.unknown().optional(),
  correct_answer_id: z.string().optional(),
  correct_item_id: z.string().optional(),
  correct_image_id: z.string().optional(),
  explanation: z.string().optional(),
  explanation_es: z.string().optional(),
  mascot_feedback: z.string().optional(),
  mascot_feedback_es: z.string().optional(),
  options: z.array(z.record(z.unknown())).optional(),
  pairs: z.array(z.record(z.unknown())).optional(),
  steps: z.array(z.record(z.unknown())).optional(),
  correct_order: z.array(z.string()).optional(),
  categories: z.array(z.record(z.unknown())).optional(),
  items: z.array(z.record(z.unknown())).optional(),
  variables: z.array(z.record(z.unknown())).optional(),
  valid_combinations: z.array(z.record(z.unknown())).optional(),
  images: z.array(z.record(z.unknown())).optional(),
}).passthrough();

const TrackImportLessonSchema = z.object({
  lesson_id: z.string().optional(),
  lesson_title: z.string().min(1),
  lesson_title_es: z.string().min(1),
  intro_text: z.string().optional(),
  intro_text_es: z.string().optional(),
  estimated_minutes: z.number().optional(),
  exercises: z.array(TrackImportExerciseSchema).min(1),
});

const TrackImportUnitSchema = z.object({
  unit_id: z.string().optional(),
  unit_title: z.string().min(1),
  unit_title_es: z.string().min(1),
  description: z.string().optional(),
  description_es: z.string().optional(),
  icon: z.string().optional(),
  estimated_minutes: z.number().optional(),
  lessons: z.array(TrackImportLessonSchema).min(1),
});

export const TrackImportSchema = z.object({
  section_id: z.string().optional(),
  section_title: z.string().min(1),
  section_title_es: z.string().min(1),
  _lesson_summary: z.record(z.unknown()).optional(),
  units: z.array(TrackImportUnitSchema).min(1),
  next_step: z.string().optional(),
}).passthrough();

export type TrackImportData = z.infer<typeof TrackImportSchema>;
export type TrackImportUnit = z.infer<typeof TrackImportUnitSchema>;
export type TrackImportLesson = z.infer<typeof TrackImportLessonSchema>;
export type TrackImportExercise = z.infer<typeof TrackImportExerciseSchema>;

// ── Field Normalization (handle DB-export format) ──

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeExercise(ex: Record<string, any>): Record<string, any> {
  const { exercise_type, question_data, ...rest } = ex;
  return {
    ...rest,
    ...(question_data && typeof question_data === "object" ? question_data : {}),
    type: ex.type ?? exercise_type,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeLesson(l: Record<string, any>): Record<string, any> {
  return {
    ...l,
    lesson_title: l.lesson_title ?? l.name,
    lesson_title_es: l.lesson_title_es ?? l.name_es,
    exercises: (l.exercises ?? []).map(normalizeExercise),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeUnit(u: Record<string, any>): Record<string, any> {
  return {
    ...u,
    unit_title: u.unit_title ?? u.name,
    unit_title_es: u.unit_title_es ?? u.name_es,
    lessons: (u.lessons ?? []).map(normalizeLesson),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeSection(s: Record<string, any>): Record<string, any> {
  return {
    ...s,
    units: (s.units ?? []).map(normalizeUnit),
  };
}

// ── Validation ──

export interface TrackValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  data?: TrackImportData;
}

export function validateTrackImportJson(raw: string): TrackValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { valid: false, errors: ["Invalid JSON syntax"], warnings: [] };
  }

  // Unwrap common wrapper formats
  let sectionPayload: unknown = parsed;
  if (typeof parsed === "object" && parsed !== null) {
    const obj = parsed as Record<string, unknown>;
    if (Array.isArray(obj.sections) && obj.sections.length > 0) {
      sectionPayload = obj.sections[0];
    } else if (obj.track && typeof obj.track === "object") {
      sectionPayload = obj.track;
    } else if (obj.data && typeof obj.data === "object") {
      sectionPayload = obj.data;
    }
  }

  // Normalize field names (DB-export format → importer schema)
  if (typeof sectionPayload === "object" && sectionPayload !== null) {
    sectionPayload = normalizeSection(sectionPayload as Record<string, unknown>);
  }

  const result = TrackImportSchema.safeParse(sectionPayload);
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
      warnings: [],
    };
  }

  const data = result.data;

  // Business-rule warnings per lesson
  for (const [ui, unit] of data.units.entries()) {
    for (const [li, lesson] of unit.lessons.entries()) {
      if (lesson.exercises.length < 5) {
        warnings.push(`Unit ${ui + 1}, Lesson ${li + 1} "${lesson.lesson_title}" has only ${lesson.exercises.length} exercises (recommended ≥ 5)`);
      }

      const types = new Set(lesson.exercises.map((e) => e.type));
      if (types.size < 3) {
        warnings.push(`Unit ${ui + 1}, Lesson ${li + 1} uses only ${types.size} exercise type(s) (recommended ≥ 3)`);
      }

      const avgDiff = lesson.exercises.reduce((s, e) => s + (e.difficulty_score ?? 50), 0) / lesson.exercises.length;
      if (li === 0 && avgDiff > 50) {
        warnings.push(`Unit ${ui + 1}, first lesson avg difficulty is ${avgDiff.toFixed(0)} (>50 may be too hard for intro)`);
      }
    }
  }

  return { valid: true, errors: [], warnings, data };
}
