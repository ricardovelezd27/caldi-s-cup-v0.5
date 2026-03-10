import { useLanguage } from "@/contexts/language";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface HeartsEmptyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeUntilRefill: number | null; // ms
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function HeartsEmptyModal({ open, onOpenChange, timeUntilRefill }: HeartsEmptyModalProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={() => { /* non-dismissible */ }}>
      <DialogContent
        className="text-center border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))] max-w-sm [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <span className="text-5xl">💔</span>
          <h2 className="font-bangers text-2xl text-foreground tracking-wide">
            Out of Hearts!
          </h2>

          <p className="font-inter text-sm text-muted-foreground">
            All 5 hearts will replenish in{" "}
            <span className="font-bold text-foreground">
              {timeUntilRefill != null ? formatTime(timeUntilRefill) : "—"}
            </span>
          </p>

          <div className="w-full flex flex-col gap-2 mt-2">
            <Button
              onClick={() => navigate("/learn")}
              className="w-full font-bangers tracking-wide"
            >
              Go to Learn Home
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/profile")}
              className="w-full font-bangers tracking-wide"
            >
              Go to Profile
            </Button>

            <Button
              variant="outline"
              disabled
              onClick={() => toast("Premium features coming soon!")}
              className="w-full font-bangers tracking-wide relative"
            >
              Purchase Hearts
              <Badge variant="secondary" className="ml-2 text-[10px]">
                {t("common.comingSoon")}
              </Badge>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
