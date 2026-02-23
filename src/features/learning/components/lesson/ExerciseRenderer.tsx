import { useLanguage } from "@/contexts/language";
import type { LearningExercise } from "../../types";

interface ExerciseRendererProps {
  exercise: LearningExercise;
  onAnswer: (answer: any, isCorrect: boolean) => void;
  disabled: boolean;
}

export function ExerciseRenderer({ exercise, onAnswer, disabled }: ExerciseRendererProps) {
  const { t } = useLanguage();
  const questionData = exercise.questionData as any;
  const question = questionData?.question ?? questionData?.prompt ?? "";

  const typeLabel = exercise.exerciseType
    .split("_")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      {/* Exercise type badge */}
      <span className="inline-block px-3 py-1 mb-4 rounded-full border-2 border-border bg-card text-xs font-inter font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_hsl(var(--border))]">
        {typeLabel}
      </span>

      {/* Question */}
      {question && (
        <p className="text-lg font-inter text-foreground mb-6 max-w-md">{question}</p>
      )}

      {/* Placeholder */}
      <div className="rounded-lg border-4 border-dashed border-border p-8 bg-card/50 max-w-sm w-full">
        <p className="text-muted-foreground font-inter text-sm">
          {t("learn.exercise.placeholder")}
        </p>
      </div>

      {/* Temp submit for testing flow */}
      {!disabled && (
        <button
          onClick={() => onAnswer(null, Math.random() > 0.4)}
          className="mt-6 px-6 py-2 rounded-lg border-4 border-border bg-primary text-primary-foreground font-bangers tracking-wide shadow-[4px_4px_0px_0px_hsl(var(--border))] hover:-translate-y-0.5 transition-transform"
        >
          {t("learn.exercise.check")}
        </button>
      )}
    </div>
  );
}
