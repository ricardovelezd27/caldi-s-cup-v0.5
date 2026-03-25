import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import { getTribeDefinition } from "@/features/quiz/data/tribes";
import { useUserRank } from "@/features/gamification";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import type { WidgetComponentProps } from "./types";
import { TribeInfoModal } from "./TribeInfoModal";
import { WidgetCategoryTag } from "./WidgetCategoryTag";

export function WelcomeHeroWidget({ widget }: WidgetComponentProps) {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const tribe = profile?.coffee_tribe ?? null;
  const tribeDef = tribe ? getTribeDefinition(tribe) : null;
  const { currentRank, nextRank, progressToNext, xpNeeded } = useUserRank();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="relative h-full overflow-hidden rounded-lg bg-card p-4">
      {/* Top row: tribe intro + desktop button */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1">
          {tribeDef ? (
            <>
              <p className="leading-relaxed text-primary-foreground text-lg font-medium">
                {t("widgets.youreA")} <span className={`font-bold ${tribeDef.colorClass}`}>{t(`tribes.${tribe}.name`)}</span> — {t(`tribes.${tribe}.title`).toLowerCase()}.
              </p>
              <p className="text-primary-foreground text-base">
                {t(`tribes.${tribe}.description`)}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("widgets.readyToDiscover")}{" "}
              <a href="/quiz" className="text-secondary underline hover:text-secondary/80 font-medium">
                {t("widgets.takeTheQuiz")}
              </a>
            </p>
          )}
        </div>

        {/* Desktop: top-right button */}
        {tribeDef && (
          <Button
            variant="outline"
            size="sm"
            className="hidden md:inline-flex shrink-0 text-xs gap-1.5"
            onClick={() => setModalOpen(true)}
          >
            <Info className="h-3.5 w-3.5" />
            {t("widgets.myTribe")} {tribeDef.emoji}
          </Button>
        )}
      </div>

      {/* Tribe values */}
      {tribeDef && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {t(`tribes.${tribe}.values`).split(",").map((v) => (
            <span
              key={v}
              className="text-xs font-medium px-2 py-0.5 rounded-full border border-border/50 bg-muted/50 text-muted-foreground"
            >
              {v}
            </span>
          ))}
        </div>
      )}

      {/* Mobile: full-width button below values */}
      {tribeDef && (
        <div className="mt-3 md:hidden">
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 w-full"
            onClick={() => setModalOpen(true)}
          >
            <Info className="h-3.5 w-3.5" />
            {t("widgets.myTribe")} {tribeDef.emoji}
          </Button>
        </div>
      )}

      {/* Rank + Progress */}
      <div className="space-y-1.5 mt-4 pt-3 border-t border-border/30">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${currentRank.colorClass} border-2 text-sm font-bold`}>
            <span className="mr-1">{currentRank.icon}</span>
            {currentRank.name}
          </Badge>
          {nextRank && (
            <span className="text-muted-foreground/70 text-sm">
              → {nextRank.icon} {nextRank.name}
            </span>
          )}
        </div>
        <Progress value={progressToNext} className="h-2" />
        <p className="font-inter text-muted-foreground text-sm">
          {nextRank
            ? `${xpNeeded} ${t("widgets.xpTo")} ${nextRank.name}`
            : t("widgets.maxRank")}
        </p>
      </div>

      <TribeInfoModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
