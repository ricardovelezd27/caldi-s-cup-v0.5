import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { getTribeDefinition } from "@/features/quiz/data/tribes";
import { useUserRank } from "@/features/gamification";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { WidgetComponentProps } from "./types";
import { TribeInfoModal } from "./TribeInfoModal";

export function WelcomeHeroWidget({ widget }: WidgetComponentProps) {
  const { profile } = useAuth();
  const tribeDef = profile?.coffee_tribe ? getTribeDefinition(profile.coffee_tribe) : null;
  const { currentRank, nextRank, progressToNext, xpNeeded } = useUserRank();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="relative h-full overflow-hidden rounded-lg border-4 border-border bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 p-6 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-4 right-4 text-8xl">☕</div>
        <div className="absolute bottom-4 left-4 text-6xl">✨</div>
      </div>

      <div className="relative space-y-3">
        {tribeDef ? (
          <>
            <p className="text-muted-foreground">
              You're a <span className="font-semibold text-secondary">{tribeDef.name}</span> — {tribeDef.title.toLowerCase()}.
              Let's continue your coffee journey.
            </p>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(true)}>
              Learn about your tribe {tribeDef.emoji}
            </Button>
          </>
        ) : (
          <p className="text-muted-foreground">
            Ready to discover your coffee personality?{" "}
            <a href="/quiz" className="text-secondary underline hover:text-secondary/80">
              Take the quiz
            </a>
          </p>
        )}

        {/* Rank Badge + Progress */}
        <div className="space-y-2 pt-1">
          <Badge variant="outline" className={`${currentRank.colorClass} border-2 text-sm font-bold`}>
            <span className="mr-1">{currentRank.icon}</span>
            {currentRank.name}
          </Badge>
          <Progress value={progressToNext} className="h-2" />
          <p className="text-xs font-inter text-muted-foreground">
            {nextRank
              ? `${xpNeeded} XP to ${nextRank.name}`
              : "Max Rank Achieved! ☕🏆"}
          </p>
        </div>
      </div>

      <TribeInfoModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
