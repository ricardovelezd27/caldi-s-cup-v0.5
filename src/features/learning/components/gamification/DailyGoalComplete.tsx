import { useLanguage } from "@/contexts/language";
import { MascotCharacter } from "../mascot/MascotCharacter";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DailyGoalCompleteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DailyGoalComplete({ open, onOpenChange }: DailyGoalCompleteProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-center border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))] max-w-sm">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative">
            <span className="absolute -top-3 -left-4 text-2xl animate-bounce">🎯</span>
            <span className="absolute -top-2 right-0 text-xl animate-bounce delay-100">✨</span>
            <MascotCharacter mascot="caldi" mood="celebrating" size="lg" />
          </div>

          <h2 className="font-bangers text-3xl text-foreground tracking-wide">
            {t("learn.dailyGoal")} ✓
          </h2>
          <p className="text-muted-foreground font-inter">{t("learn.greatJob")}</p>

          <Button onClick={() => onOpenChange(false)} className="font-bangers tracking-wide">
            {t("learn.exercise.continue")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
