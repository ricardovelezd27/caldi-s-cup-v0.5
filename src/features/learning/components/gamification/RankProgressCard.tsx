import { useLanguage } from "@/contexts/language";
import { useUserRank } from "@/features/gamification";
import { Progress } from "@/components/ui/progress";

export function RankProgressCard() {
  const { t } = useLanguage();
  const { currentRank, nextRank, progressToNext, xpNeeded, totalXP } = useUserRank();

  return (
    <div className="border-4 border-border rounded-lg bg-card p-5 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
      <h3 className="font-bangers text-lg text-foreground tracking-wide mb-3">
        {t("learn.rankProgress.title")}
      </h3>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{currentRank.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-bangers text-lg text-foreground tracking-wide">
            {currentRank.name}
          </p>
          <p className="text-xs font-inter text-muted-foreground">
            {totalXP.toLocaleString()} {t("gamification.xp")}
          </p>
        </div>
      </div>

      {nextRank ? (
        <>
          <Progress value={progressToNext} className="h-3 mb-2" />
          <div className="flex justify-between items-center text-xs font-inter text-muted-foreground">
            <span>
              {t("learn.rankProgress.xpToNext").replace("{xp}", xpNeeded.toLocaleString()).replace("{rank}", nextRank.name)}
            </span>
            <span>{nextRank.icon}</span>
          </div>
        </>
      ) : (
        <p className="text-sm font-inter text-secondary font-medium text-center">
          ☕ {t("learn.rankProgress.maxRank")}
        </p>
      )}
    </div>
  );
}
