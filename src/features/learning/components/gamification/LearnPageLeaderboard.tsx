import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/language";
import { useAuth } from "@/contexts/auth";
import { useLeague } from "../../hooks/useLeague";
import { BARISTA_RANKS, useUserRank } from "@/features/gamification";
import { ROUTES } from "@/constants/app";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

export function LearnPageLeaderboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { league, leaderboard, isLoading } = useLeague();
  const { currentRank } = useUserRank();

  const getRankIcon = (xp: number) => {
    let icon = BARISTA_RANKS[0].icon;
    for (let i = BARISTA_RANKS.length - 1; i >= 0; i--) {
      if (xp >= BARISTA_RANKS[i].minXP) { icon = BARISTA_RANKS[i].icon; break; }
    }
    return icon;
  };

  if (isLoading) {
    return (
      <div className="border-4 border-border rounded-lg bg-card p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
        <p className="text-center text-muted-foreground font-inter text-sm py-4">{t("common.loading")}</p>
      </div>
    );
  }

  // Empty state
  if (!league || leaderboard.length === 0) {
    return (
      <div className="border-4 border-border rounded-lg bg-card p-5 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-primary" />
          <h3 className="font-bangers text-xl text-foreground tracking-wide">
            {t("learn.leaderboard.title")}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground font-inter text-center py-4">
          {t("learn.leaderboard.joinByLearning")}
        </p>
      </div>
    );
  }

  const top10 = leaderboard.slice(0, 10);

  return (
    <div className="border-4 border-border rounded-lg bg-card shadow-[4px_4px_0px_0px_hsl(var(--border))] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b-4 border-border bg-primary/10">
        <div className="flex items-center gap-2">
          <span className="text-xl">{league.icon}</span>
          <h3 className="font-bangers text-xl text-foreground tracking-wide">
            {t("learn.leaderboard.title")}
          </h3>
        </div>
      </div>

      {/* Entries */}
      <div className="divide-y divide-border/30">
        {top10.map((entry) => {
          const isMe = entry.userId === user?.id;
          return (
            <div
              key={entry.userId}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 font-inter text-sm",
                isMe && "bg-secondary/15 border-l-4 border-l-secondary",
              )}
            >
              <span
                className={cn(
                  "w-6 text-center font-bold text-xs",
                  entry.rank <= 3 ? "text-primary" : "text-muted-foreground",
                )}
              >
                #{entry.rank}
              </span>
              <span className="text-base">{isMe ? currentRank.icon : getRankIcon(entry.weeklyXp)}</span>
              <span className="flex-1 text-foreground truncate text-sm">
                {isMe ? t("learn.leaderboard.you") : `User ${entry.rank}`}
              </span>
              <span className="font-bold text-xs text-foreground">{entry.weeklyXp} XP</span>
            </div>
          );
        })}
      </div>

      {/* Footer link */}
      <div className="px-4 py-3 border-t-4 border-border">
        <Link
          to={ROUTES.leaderboard}
          className="block text-center text-sm font-inter font-medium text-secondary hover:text-secondary/80 transition-colors"
        >
          {t("learn.leaderboard.viewFull")} →
        </Link>
      </div>
    </div>
  );
}
