import { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { Button } from "@/components/ui/button";
import { DAILY_GOALS } from "@/features/learning/data/dailyGoals";
import { cn } from "@/lib/utils";

interface GoalPickerProps {
  onSelect: (goalXp: number) => void;
}

export function GoalPicker({ onSelect }: GoalPickerProps) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(10);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <h2 className="font-bangers text-3xl text-foreground tracking-wide text-center">
        {t("onboarding.pickGoal")}
      </h2>

      <div className="space-y-2 w-full">
        {DAILY_GOALS.map((goal) => (
          <button
            key={goal.id}
            onClick={() => setSelected(goal.xp)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg border-4 transition-all font-inter text-left",
              selected === goal.xp
                ? "border-primary bg-primary/10 shadow-[2px_2px_0px_0px_hsl(var(--primary))]"
                : "border-border hover:border-secondary"
            )}
          >
            <span className="text-xl">{goal.icon}</span>
            <div className="flex-1">
              <span className="font-bold text-foreground capitalize">{goal.id}</span>
              <span className="text-sm text-muted-foreground ml-2">
                {goal.minutes} min · {goal.xp} XP
              </span>
            </div>
            {selected === goal.xp && <span className="text-primary font-bold">✓</span>}
          </button>
        ))}
      </div>

      <Button
        onClick={() => onSelect(selected)}
        className="w-full font-bangers tracking-wide text-lg"
        size="lg"
      >
        {t("onboarding.letsGo")}
      </Button>
    </div>
  );
}
