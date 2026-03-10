import { Progress } from "@/components/ui/progress";
import { HeartsDisplay } from "../gamification/HeartsDisplay";
import { X } from "lucide-react";

interface LessonProgressProps {
  current: number;
  total: number;
  onExit: () => void;
  hearts?: number;
  maxHearts?: number;
  timeUntilRefill?: number | null;
}

export function LessonProgress({ current, total, onExit, hearts, maxHearts, timeUntilRefill }: LessonProgressProps) {
  const percent = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto w-full">
      <button
        onClick={onExit}
        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Exit lesson"
      >
        <X className="w-5 h-5" />
      </button>
      <Progress value={percent} className="h-4 flex-1 rounded-full" />
      {hearts !== undefined && maxHearts !== undefined && (
        <HeartsDisplay hearts={hearts} maxHearts={maxHearts} timeUntilRefill={timeUntilRefill} />
      )}
    </div>
  );
}
