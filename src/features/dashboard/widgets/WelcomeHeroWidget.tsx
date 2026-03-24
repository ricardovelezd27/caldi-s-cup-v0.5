import { useState } from "react";
import { useAuth } from "@/contexts/auth";
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
  const tribeDef = profile?.coffee_tribe ? getTribeDefinition(profile.coffee_tribe) : null;
  const { currentRank, nextRank, progressToNext, xpNeeded } = useUserRank();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="relative h-full overflow-hidden rounded-lg bg-card p-5">




      {/* Top row: tribe intro + desktop button */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1">
          {tribeDef ? (
            <>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You're a <span className={`font-bold ${tribeDef.colorClass}`}>{tribeDef.name}</span> — {tribeDef.title.toLowerCase()}.
              </p>
              <p className="text-xs text-muted-foreground/70">
                {tribeDef.description.slice(0, 100)}…
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Ready to discover your coffee personality?{" "}
              <a href="/quiz" className="text-secondary underline hover:text-secondary/80 font-medium">
                Take the quiz
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
            My Tribe {tribeDef.emoji}
          </Button>
        )}
      </div>

      {/* Tribe values */}
      {tribeDef && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tribeDef.values.map((v) => (
            <span
              key={v}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-border/50 bg-muted/50 text-muted-foreground"
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
            My Tribe {tribeDef.emoji}
          </Button>
        </div>
      )}

      {/* Rank + Progress */}
      <div className="space-y-1.5 mt-4 pt-3 border-t border-border/30">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${currentRank.colorClass} border-2 text-xs font-bold`}>
            <span className="mr-1">{currentRank.icon}</span>
            {currentRank.name}
          </Badge>
          {nextRank && (
            <span className="text-[10px] text-muted-foreground/70">
              → {nextRank.icon} {nextRank.name}
            </span>
          )}
        </div>
        <Progress value={progressToNext} className="h-2" />
        <p className="text-[11px] font-inter text-muted-foreground">
          {nextRank
            ? `${xpNeeded} XP to ${nextRank.name}`
            : "Max Rank Achieved! ☕🏆"}
        </p>
      </div>

      <TribeInfoModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
