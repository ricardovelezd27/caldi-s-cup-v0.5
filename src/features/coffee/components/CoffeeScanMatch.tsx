import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, CheckCircle2, XCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { CoffeeScanMeta } from "../types";
import type { CoffeeTribe } from "@/contexts/auth/AuthContext";

// ── Tribe-aware phrases ──

const TRIBE_PHRASES: Record<
  CoffeeTribe,
  { high: string; medium: string; low: string }
> = {
  fox: {
    high: "This rare gem aligns perfectly with your pursuit of the exceptional.",
    medium: "An interesting find — it has some qualities that may intrigue your refined palate.",
    low: "This coffee lacks the distinctiveness your adventurous taste demands.",
  },
  owl: {
    high: "The data speaks clearly — this coffee meets your precision standards.",
    medium: "Some metrics align with your analytical profile, but others fall short.",
    low: "The processing data doesn't match your precision standards.",
  },
  hummingbird: {
    high: "This adventurous profile has the surprises you crave!",
    medium: "There are hints of the variety you enjoy, but it plays it safe in places.",
    low: "This coffee plays it too safe for your thrill-seeking palate.",
  },
  bee: {
    high: "A reliable, comforting cup — exactly what you value most.",
    medium: "Familiar in parts, but some notes wander from the comfort zone you love.",
    low: "This coffee strays from the consistent comfort you prefer.",
  },
};

function getTribePhrase(
  tribe: CoffeeTribe | null,
  score: number
): string {
  if (!tribe) {
    if (score >= 70) return "This coffee is a great match for your taste profile.";
    if (score >= 40) return "This coffee partially matches your taste profile.";
    return "This coffee has different characteristics than your usual preferences.";
  }
  const phrases = TRIBE_PHRASES[tribe];
  if (score >= 70) return phrases.high;
  if (score >= 40) return phrases.medium;
  return phrases.low;
}

// ── Component ──

interface CoffeeScanMatchProps {
  scanMeta: CoffeeScanMeta;
  tribe?: CoffeeTribe | null;
  userMatchScore?: number | null;
  isAuthenticated?: boolean;
  onUserMatchChange?: (value: number) => void;
}

export function CoffeeScanMatch({
  scanMeta,
  tribe = null,
  userMatchScore,
  isAuthenticated = false,
  onUserMatchChange,
}: CoffeeScanMatchProps) {
  const [isReasonsOpen, setIsReasonsOpen] = useState(false);

  const aiScore = scanMeta.tribeMatchScore;
  const displayScore = userMatchScore ?? aiScore;
  const hasDifference = userMatchScore !== null && userMatchScore !== undefined && userMatchScore !== aiScore;

  const getMatchColor = (score: number) => {
    if (score >= 70) return "text-secondary";
    if (score >= 40) return "text-accent";
    return "text-destructive";
  };

  const matchColor = getMatchColor(displayScore);
  const aiMarkerPercent = aiScore;
  const isPositiveMatch = displayScore >= 50;

  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bangers text-lg text-foreground tracking-wide flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Your Match Score
        </h3>
        <span className="text-xs text-muted-foreground">
          {hasDifference ? (
            <>
              <span className="text-primary">AI: {aiScore}%</span>
              <span className="mx-1">|</span>
              <span className="text-secondary">You: {userMatchScore}%</span>
            </>
          ) : (
            <span className={`font-bangers text-2xl ${matchColor}`}>{displayScore}%</span>
          )}
        </span>
      </div>

      {/* Interactive slider */}
      <div className="relative">
        {hasDifference && (
          <div
            className="absolute top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-primary border-2 border-primary-foreground pointer-events-none"
            style={{ left: `calc(${aiMarkerPercent}% - 10px)` }}
            title={`AI: ${aiScore}%`}
          />
        )}

        {isAuthenticated ? (
          <Slider
            value={[displayScore]}
            min={0}
            max={100}
            step={1}
            onValueChange={([v]) => onUserMatchChange?.(v)}
            className="h-3 [&_[role=slider]]:cursor-grab [&_[role=slider]]:active:cursor-grabbing [&_[role=slider]]:border-secondary [&_[role=slider]]:bg-secondary"
          />
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Slider
                    value={[displayScore]}
                    min={0}
                    max={100}
                    step={1}
                    disabled
                    className="h-3 [&_[role=slider]]:cursor-default"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Sign in to rate this coffee</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Tribe-aware phrase */}
      <p className={`text-sm font-medium ${matchColor}`}>
        {getTribePhrase(tribe, displayScore)}
      </p>

      {/* Collapsible reasons */}
      {scanMeta.matchReasons.length > 0 && (
        <Collapsible open={isReasonsOpen} onOpenChange={setIsReasonsOpen}>
          <CollapsibleTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full pt-2 border-t border-border">
            {isPositiveMatch ? "Why this matches" : "Why this doesn't match"}
            {isReasonsOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <ul className="space-y-1">
              {scanMeta.matchReasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  {isPositiveMatch ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-secondary" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 mt-0.5 text-destructive" />
                  )}
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* AI Confidence */}
      <div className="text-xs text-muted-foreground pt-2 border-t border-border">
        AI Confidence: {Math.round(scanMeta.aiConfidence * 100)}%
      </div>
    </div>
  );
}
