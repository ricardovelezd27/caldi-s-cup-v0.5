import { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { Button } from "@/components/ui/button";
import { DAILY_GOALS } from "../../data/dailyGoals";
import { cn } from "@/lib/utils";

interface DailyGoalSelectorProps {
  currentGoalXp: number;
  onSave: (xp: number) => Promise<void>;
  onClose?: () => void;
}

export function DailyGoalSelector({ currentGoalXp, onSave, onClose }: DailyGoalSelectorProps) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(currentGoalXp || 10);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(selected);
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  const goalLabels: Record<string, string> = {
    casual: t("learn.exercise.skip"),
    regular: t("learn.exercise.continue"),
    serious: t("learn.exercise.check"),
    intense: t("learn.exercise.calculate"),
  };

  return (
    <div className="p-4 border-4 border-border rounded-lg bg-card shadow-[4px_4px_0px_0px_hsl(var(--border))]">
      <h3 className="font-bangers text-xl text-foreground tracking-wide mb-4">
        {t("learn.dailyGoal")}
      </h3>

      <div className="space-y-2 mb-4">
        {DAILY_GOALS.map((goal) => (
          <button
            key={goal.id}
            onClick={() => setSelected(goal.xp)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg border-4 transition-all font-inter text-left",
              selected === goal.xp
                ? "border-primary bg-primary/10 shadow-[2px_2px_0px_0px_hsl(var(--primary))]"
                : "border-border hover:border-secondary",
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
        onClick={handleSave}
        disabled={saving}
        className="w-full font-bangers tracking-wide"
      >
        {saving ? t("common.loading") : t("common.save")}
      </Button>
    </div>
  );
}
