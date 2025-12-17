import { CheckCircle2, XCircle, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth";
import { TRIBES } from "@/features/quiz/data/tribes";
import type { ScannedCoffee } from "../types/scanner";

interface PreferenceMatchCardProps {
  data: ScannedCoffee;
}

function MatchGauge({ score }: { score: number }) {
  // Determine color based on score
  const getColor = () => {
    if (score >= 75) return "text-secondary";
    if (score >= 50) return "text-primary";
    return "text-accent";
  };

  const getLabel = () => {
    if (score >= 75) return "Great Match!";
    if (score >= 50) return "Good Match";
    return "Different Style";
  };

  // SVG arc calculation
  const radius = 60;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="100" viewBox="0 0 160 100">
        {/* Background arc */}
        <path
          d="M 20 90 A 60 60 0 0 1 140 90"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Foreground arc */}
        <path
          d="M 20 90 A 60 60 0 0 1 140 90"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          className={getColor()}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            transition: "stroke-dashoffset 1s ease-out",
          }}
        />
      </svg>
      <div className="text-center -mt-4">
        <span className={`font-bangers text-4xl ${getColor()}`}>{score}%</span>
        <p className="text-sm text-muted-foreground mt-1">{getLabel()}</p>
      </div>
    </div>
  );
}

export function PreferenceMatchCard({ data }: PreferenceMatchCardProps) {
  const { profile } = useAuth();
  const tribe = profile?.coffee_tribe ? TRIBES[profile.coffee_tribe] : null;

  return (
    <Card className="border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))] h-full">
      <CardHeader>
        <CardTitle className="font-bangers text-xl">Your Match</CardTitle>
        {tribe && (
          <p className="text-sm text-muted-foreground">
            Based on your{" "}
            <span className={tribe.colorClass}>
              {tribe.emoji} {tribe.name}
            </span>{" "}
            profile
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Match Gauge */}
        <MatchGauge score={data.tribeMatchScore} />

        {/* Match Reasons */}
        {data.matchReasons && data.matchReasons.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-foreground">Why this score?</h4>
            <ul className="space-y-2">
              {data.matchReasons.map((reason, i) => {
                const isPositive = reason.toLowerCase().includes("contains") || 
                                  reason.toLowerCase().includes("aligns");
                const isNeutral = reason.toLowerCase().includes("different");
                
                return (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    {isPositive ? (
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    ) : isNeutral ? (
                      <Minus className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    )}
                    <span className="text-muted-foreground">{reason}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Tribe Keywords Reminder */}
        {tribe && (
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Your preferences: </span>
              {tribe.keywords.slice(0, 5).join(", ")}...
            </p>
          </div>
        )}

        {/* No Tribe Message */}
        {!tribe && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Take the{" "}
              <a href="/quiz" className="text-primary hover:underline font-medium">
                Coffee Personality Quiz
              </a>{" "}
              to get personalized match scores!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
