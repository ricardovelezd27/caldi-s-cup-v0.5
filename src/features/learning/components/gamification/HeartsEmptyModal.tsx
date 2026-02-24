import { useLanguage } from "@/contexts/language";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface HeartsEmptyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeUntilNextHeart: number | null; // ms
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function HeartsEmptyModal({ open, onOpenChange, timeUntilNextHeart }: HeartsEmptyModalProps) {
  const { t } = useLanguage();
  const [remaining, setRemaining] = useState(timeUntilNextHeart ?? 0);

  useEffect(() => {
    if (!open || !timeUntilNextHeart) return;
    setRemaining(timeUntilNextHeart);
    const interval = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [open, timeUntilNextHeart]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-center border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))] max-w-sm">
        <div className="flex flex-col items-center gap-4 py-4">
          <span className="text-5xl">💔</span>
          <h2 className="font-bangers text-2xl text-foreground tracking-wide">
            Out of Hearts!
          </h2>

          <div className="w-full space-y-2">
            <button className="w-full p-3 border-4 border-border rounded-lg font-inter text-sm text-left hover:bg-primary/10 transition-colors">
              <span className="font-bold">📚 Practice to earn hearts</span>
              <span className="block text-xs text-muted-foreground mt-0.5">
                {t("common.comingSoon")}
              </span>
            </button>

            <button className="w-full p-3 border-4 border-border rounded-lg font-inter text-sm text-left">
              <span className="font-bold">⏰ Wait for refill</span>
              <span className="block text-xs text-muted-foreground mt-0.5">
                Next heart in {formatTime(remaining)}
              </span>
            </button>

            <button className="w-full p-3 border-4 border-border rounded-lg font-inter text-sm text-left opacity-60">
              <span className="font-bold">⭐ Go Premium</span>
              <span className="block text-xs text-muted-foreground mt-0.5">
                {t("common.comingSoon")}
              </span>
            </button>
          </div>

          <Button variant="outline" onClick={() => onOpenChange(false)} className="font-bangers tracking-wide">
            {t("common.cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
