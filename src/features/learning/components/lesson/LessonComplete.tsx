import { useLanguage } from "@/contexts/language";
import { MascotCharacter } from "../mascot/MascotCharacter";
import { XPCounter } from "../gamification/XPCounter";
import { Button } from "@/components/ui/button";

interface LessonCompleteProps {
  correct: number;
  total: number;
  xpEarned: number;
  timeSpent: number;
  onNext?: () => void;
  onBackToTrack: () => void;
}

export function LessonComplete({
  correct,
  total,
  xpEarned,
  timeSpent,
  onNext,
  onBackToTrack,
}: LessonCompleteProps) {
  const { t } = useLanguage();
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      {/* Confetti-like emoji rain */}
      <div className="relative mb-4">
        <span className="absolute -top-4 -left-6 text-2xl animate-bounce">☕</span>
        <span className="absolute -top-2 left-8 text-xl animate-bounce delay-100">🎉</span>
        <span className="absolute -top-4 right-0 text-2xl animate-bounce delay-200">⭐</span>
        <MascotCharacter mascot="caldi" mood="celebrating" size="lg" />
      </div>

      <h2 className="font-bangers text-3xl text-foreground tracking-wide mb-2">
        {t("learn.lessonComplete")}
      </h2>
      <p className="text-muted-foreground font-inter mb-4">{t("learn.greatJob")}</p>

      <XPCounter xp={xpEarned} className="mb-6" />

      <div className="flex items-center gap-6 mb-8 text-sm font-inter text-muted-foreground">
        <div>
          <span className="font-bold text-foreground">{percent}%</span> {t("learn.score")}
        </div>
        <div>
          <span className="font-bold text-foreground">
            {correct}/{total}
          </span>{" "}
          {t("learn.exercise.correct")}
        </div>
        <div>
          <span className="font-bold text-foreground">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>{" "}
          {t("learn.timeSpent")}
        </div>
      </div>

      <div className="flex gap-3">
        {onNext && (
          <Button onClick={onNext} className="font-bangers tracking-wide">
            {t("learn.nextLesson")}
          </Button>
        )}
        <Button onClick={onBackToTrack} variant="outline" className="font-bangers tracking-wide">
          {t("learn.backToTrack")}
        </Button>
      </div>
    </div>
  );
}
