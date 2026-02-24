import { useLanguage } from "@/contexts/language";
import { MascotReaction } from "../../mascot/MascotReaction";
import { getRandomDialogue } from "../../../data/mascotDialogues";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sounds } from "../../../utils/sounds";
import { useEffect } from "react";

interface ExerciseFeedbackProps {
  isCorrect: boolean;
  explanation?: string;
  mascot?: "caldi" | "goat";
  onContinue: () => void;
}

export function ExerciseFeedback({
  isCorrect,
  explanation,
  mascot = "caldi",
  onContinue,
}: ExerciseFeedbackProps) {
  const { t } = useLanguage();
  const dialogue = getRandomDialogue(mascot, isCorrect ? "correct" : "incorrect");

  useEffect(() => {
    isCorrect ? sounds.playCorrect() : sounds.playIncorrect();
  }, [isCorrect]);

  return (
    <div
      className={cn(
        "rounded-lg border-4 p-6 mx-4 mb-4 animate-in slide-in-from-bottom-4 duration-300",
        isCorrect
          ? "border-[hsl(142_71%_45%)] bg-[hsl(142_76%_90%)]"
          : "border-accent bg-accent/10",
      )}
      style={{ boxShadow: "4px 4px 0px 0px hsl(var(--border))" }}
    >
      <div className="flex items-start gap-4">
        <MascotReaction
          mascot={mascot}
          mood={isCorrect ? "celebrating" : "thinking"}
          dialogue={dialogue}
          size="sm"
        />
      </div>

      <p className="font-bangers text-xl mt-3 text-foreground">
        {isCorrect ? t("learn.exercise.correct") : t("learn.exercise.incorrect")}
      </p>

      {explanation && (
        <p className="text-sm font-inter text-muted-foreground mt-2">{explanation}</p>
      )}

      <Button onClick={onContinue} className="mt-4 font-bangers tracking-wide" variant="outline">
        {t("learn.exercise.continue")}
      </Button>
    </div>
  );
}
