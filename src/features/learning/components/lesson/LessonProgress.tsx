import { useLanguage } from "@/contexts/language";
import { Progress } from "@/components/ui/progress";
import { HeartsDisplay } from "../gamification/HeartsDisplay";
import { X } from "lucide-react";

interface LessonProgressProps {
  current: number;
  total: number;
  onExit: () => void;
  hearts?: number;
  maxHearts?: number;
}

export function LessonProgress({ current, total, onExit, hearts, maxHearts }: LessonProgressProps) {
  const { t } = useLanguage();
  const percent = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <button
        onClick={onExit}
        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Exit lesson"
      >
        <X className="w-5 h-5" />
      </button>
      <Progress value={percent} className="h-3 flex-1" />
      <span className="text-xs font-inter text-muted-foreground whitespace-nowrap">
        {current} {t("learn.exerciseOf")} {total}
      </span>
      {hearts !== undefined && maxHearts !== undefined && (
        <HeartsDisplay hearts={hearts} maxHearts={maxHearts} />
      )}
    </div>
  );
}
