import { useLanguage } from "@/contexts/language";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XPCounter } from "./XPCounter";
import { sounds } from "../../utils/sounds";
import type { LearningAchievement } from "../../types";
import { useEffect } from "react";

interface AchievementUnlockProps {
  achievement: LearningAchievement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AchievementUnlock({ achievement, open, onOpenChange }: AchievementUnlockProps) {
  const { language } = useLanguage();

  useEffect(() => {
    if (open) sounds.playCelebration();
  }, [open]);

  if (!achievement) return null;

  const name = language === "es" ? achievement.nameEs : achievement.name;
  const desc = language === "es" ? achievement.descriptionEs : achievement.description;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-center border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))] max-w-sm">
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="relative">
            <span className="absolute -top-4 -left-6 text-2xl animate-bounce">✨</span>
            <span className="absolute -top-2 right-0 text-xl animate-bounce delay-200">🎉</span>
          </div>

          <span className="text-6xl animate-bounce">{achievement.icon}</span>

          <h2 className="font-bangers text-2xl text-foreground tracking-wide">
            Achievement Unlocked!
          </h2>

          <p className="font-bangers text-xl text-primary tracking-wide">{name}</p>
          <p className="text-sm font-inter text-muted-foreground">{desc}</p>

          <XPCounter xp={achievement.xpReward} />

          <Button onClick={() => onOpenChange(false)} className="font-bangers tracking-wide">
            Awesome!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
