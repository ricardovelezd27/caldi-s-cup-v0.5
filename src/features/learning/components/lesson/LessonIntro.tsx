import { useLanguage } from "@/contexts/language";
import { MascotReaction } from "../mascot/MascotReaction";
import { getRandomDialogue } from "../../data/mascotDialogues";
import { Button } from "@/components/ui/button";
import { Clock, Zap } from "lucide-react";

interface LessonIntroProps {
  lessonName?: string;
  introText?: string;
  estimatedMinutes?: number;
  xpReward?: number;
  mascot?: "caldi" | "goat";
  onStart: () => void;
}

export function LessonIntro({
  lessonName,
  introText,
  estimatedMinutes = 4,
  xpReward = 10,
  mascot = "caldi",
  onStart,
}: LessonIntroProps) {
  const { t } = useLanguage();
  const greeting = getRandomDialogue(mascot, "greeting");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <MascotReaction mascot={mascot} mood="encouraging" dialogue={greeting} size="lg" />

      {lessonName && (
        <h2 className="font-bangers text-2xl md:text-3xl text-foreground tracking-wide mt-6 mb-2">
          {lessonName}
        </h2>
      )}

      {introText && (
        <p className="text-muted-foreground font-inter max-w-md mb-6">{introText}</p>
      )}

      <div className="flex items-center gap-4 mb-8">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border-2 border-border bg-card text-xs font-inter font-medium shadow-[2px_2px_0px_0px_hsl(var(--border))]">
          <Clock className="w-3 h-3" />
          ~{estimatedMinutes} {t("learn.estimatedTime")}
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border-2 border-border bg-primary/10 text-xs font-inter font-medium shadow-[2px_2px_0px_0px_hsl(var(--border))]">
          <Zap className="w-3 h-3" />
          +{xpReward} XP
        </span>
      </div>

      <Button onClick={onStart} size="lg" className="font-bangers text-lg tracking-wide px-10">
        {t("learn.start")}
      </Button>
    </div>
  );
}
