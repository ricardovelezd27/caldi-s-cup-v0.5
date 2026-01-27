import { Heart, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { ScannedCoffee } from "../types/scanner";

interface ScanResultsMatchProps {
  data: ScannedCoffee;
}

function getMatchLabel(score: number): string {
  if (score >= 80) return "Excellent Match!";
  if (score >= 60) return "Good Match";
  if (score >= 40) return "Fair Match";
  return "Try Something New";
}

function getMatchColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-secondary";
  if (score >= 40) return "text-accent";
  return "text-muted-foreground";
}

export function ScanResultsMatch({ data }: ScanResultsMatchProps) {
  const matchScore = data.tribeMatchScore || 0;
  const matchLabel = getMatchLabel(matchScore);
  const matchColor = getMatchColor(matchScore);

  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card space-y-4">
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-destructive" />
        <h3 className="font-bangers text-lg text-foreground tracking-wide">
          Your Match
        </h3>
      </div>

      {/* Match Score Gauge */}
      <div className="text-center space-y-2">
        <div className="font-bangers text-5xl text-primary">
          {matchScore}%
        </div>
        <p className={`font-semibold ${matchColor}`}>
          {matchLabel}
        </p>
        <Progress value={matchScore} className="h-3" />
      </div>

      {/* Match Reasons */}
      {data.matchReasons && data.matchReasons.length > 0 && (
        <div className="pt-3 border-t border-border space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            Why this matches your taste
          </p>
          <ul className="space-y-1.5">
            {data.matchReasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
