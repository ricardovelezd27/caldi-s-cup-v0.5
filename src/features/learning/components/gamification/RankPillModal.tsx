import { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RankProgressCard } from "./RankProgressCard";
import { useUserRank } from "@/features/gamification";

export function RankPillModal() {
  const { t } = useLanguage();
  const { currentRank } = useUserRank();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card hover:bg-primary/10 transition-colors"
        style={{
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: "hsl(var(--border))",
          boxShadow: "2px 2px 0px 0px hsl(var(--border))",
        }}
      >
        <span className="text-base">{currentRank.icon}</span>
        <span className="font-bangers text-sm text-foreground tracking-wide">
          {currentRank.name}
        </span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{t("learn.rankProgress.title")}</DialogTitle>
          </DialogHeader>
          <div className="p-1">
            <RankProgressCard />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
