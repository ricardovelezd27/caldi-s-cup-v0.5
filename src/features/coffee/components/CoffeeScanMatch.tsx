import { Sparkles, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { CoffeeScanMeta } from "../types";

interface CoffeeScanMatchProps {
  scanMeta: CoffeeScanMeta;
}

export function CoffeeScanMatch({ scanMeta }: CoffeeScanMatchProps) {
  const matchScore = scanMeta.tribeMatchScore;
  
  const getMatchLevel = () => {
    if (matchScore >= 80) return { label: "Excellent Match", color: "text-green-600" };
    if (matchScore >= 60) return { label: "Good Match", color: "text-primary" };
    if (matchScore >= 40) return { label: "Fair Match", color: "text-accent" };
    return { label: "Low Match", color: "text-muted-foreground" };
  };

  const match = getMatchLevel();

  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bangers text-lg text-foreground tracking-wide flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Your Match Score
        </h3>
        <span className={`font-bangers text-2xl ${match.color}`}>
          {matchScore}%
        </span>
      </div>

      <Progress value={matchScore} className="h-3" />

      <p className={`text-sm font-medium ${match.color}`}>
        {match.label} for your taste profile
      </p>

      {scanMeta.matchReasons.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border">
          <p className="text-sm font-medium text-foreground">Why this matches:</p>
          <ul className="space-y-1">
            {scanMeta.matchReasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-green-600" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Confidence */}
      <div className="text-xs text-muted-foreground pt-2 border-t border-border">
        AI Confidence: {Math.round(scanMeta.aiConfidence * 100)}%
      </div>
    </div>
  );
}
