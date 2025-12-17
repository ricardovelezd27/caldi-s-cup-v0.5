import { getTribeDefinition } from "@/features/quiz/data/tribes";
import type { CoffeeTribe } from "@/features/quiz/types/tribe";

interface WelcomeHeroProps {
  displayName: string | null;
  tribe: CoffeeTribe | null;
}

export function WelcomeHero({ displayName, tribe }: WelcomeHeroProps) {
  const tribeDef = tribe ? getTribeDefinition(tribe) : null;
  const greeting = displayName || "Coffee Explorer";

  return (
    <div className="relative overflow-hidden rounded-lg border-4 border-border bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 p-6 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 text-8xl">☕</div>
        <div className="absolute bottom-4 left-4 text-6xl">✨</div>
      </div>

      <div className="relative">
        <h1 className="font-bangers text-3xl md:text-4xl tracking-wide text-foreground mb-2">
          Welcome, {greeting}!
        </h1>
        {tribeDef ? (
          <p className="text-muted-foreground">
            You're a <span className="font-semibold text-secondary">{tribeDef.name}</span> — {tribeDef.title.toLowerCase()}. 
            Let's continue your coffee journey.
          </p>
        ) : (
          <p className="text-muted-foreground">
            Ready to discover your coffee personality?{" "}
            <a href="/quiz" className="text-secondary underline hover:text-secondary/80">
              Take the quiz
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
