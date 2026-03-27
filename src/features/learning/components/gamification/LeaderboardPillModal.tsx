import { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LearnPageLeaderboard } from "./LearnPageLeaderboard";
import { useLeague } from "../../hooks/useLeague";

export function LeaderboardPillModal() {
  const { t } = useLanguage();
  const { myRank } = useLeague();
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
        <Trophy className="h-4 w-4 text-primary" />
        <span className="font-bangers text-sm text-foreground tracking-wide">
          {myRank ? `#${myRank}` : t("learn.leaderboard.title")}
        </span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{t("learn.leaderboard.title")}</DialogTitle>
          </DialogHeader>
          <LearnPageLeaderboard />
        </DialogContent>
      </Dialog>
    </>
  );
}
