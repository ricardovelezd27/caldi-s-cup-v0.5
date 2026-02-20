import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, CheckCircle2, XCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { CoffeeScanMeta } from "../types";
import type { CoffeeTribe } from "@/contexts/auth/AuthContext";
import { useLanguage } from "@/contexts/language";

function getTribePhrase(t: (key: string) => string, tribe: CoffeeTribe | null, score: number): string {
  if (!tribe) {
    if (score >= 70) return t('tribes.matchHigh');
    if (score >= 40) return t('tribes.matchMed');
    return t('tribes.matchLow');
  }
  if (score >= 70) return t(`tribes.${tribe}High`);
  if (score >= 40) return t(`tribes.${tribe}Med`);
  return t(`tribes.${tribe}Low`);
}

interface CoffeeScanMatchProps { scanMeta: CoffeeScanMeta; tribe?: CoffeeTribe | null; userMatchScore?: number | null; isAuthenticated?: boolean; onUserMatchChange?: (value: number) => void; }

export function CoffeeScanMatch({ scanMeta, tribe = null, userMatchScore, isAuthenticated = false, onUserMatchChange }: CoffeeScanMatchProps) {
  const [isReasonsOpen, setIsReasonsOpen] = useState(false);
  const { t } = useLanguage();
  const aiScore = scanMeta.tribeMatchScore;
  const displayScore = userMatchScore ?? aiScore;
  const hasDifference = userMatchScore !== null && userMatchScore !== undefined && userMatchScore !== aiScore;
  const getMatchColor = (score: number) => { if (score >= 70) return "text-secondary"; if (score >= 40) return "text-accent"; return "text-destructive"; };
  const matchColor = getMatchColor(displayScore);
  const aiMarkerPercent = aiScore;
  const isPositiveMatch = displayScore >= 50;

  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bangers text-lg text-foreground tracking-wide flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />{t('coffee.matchScore')}</h3>
        <span className="text-xs text-muted-foreground">
          {hasDifference ? (<><span className="text-primary">AI: {aiScore}%</span><span className="mx-1">|</span><span className="text-secondary">You: {userMatchScore}%</span></>) : (<span className={`font-bangers text-2xl ${matchColor}`}>{displayScore}%</span>)}
        </span>
      </div>
      {isAuthenticated && (<p className="text-xs text-muted-foreground italic -mt-2">{t('coffee.adjustScore')}</p>)}
      <div className="relative">
        {hasDifference && (<div className="absolute top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-primary border-2 border-primary-foreground pointer-events-none" style={{ left: `calc(${aiMarkerPercent}% - 10px)` }} title={`AI: ${aiScore}%`} />)}
        {isAuthenticated ? (
          <Slider value={[displayScore]} min={0} max={100} step={1} onValueChange={([v]) => onUserMatchChange?.(v)} className="h-3 [&_[role=slider]]:cursor-grab [&_[role=slider]]:active:cursor-grabbing [&_[role=slider]]:border-secondary [&_[role=slider]]:bg-secondary" />
        ) : (
          <TooltipProvider><Tooltip><TooltipTrigger asChild><div><Slider value={[displayScore]} min={0} max={100} step={1} disabled className="h-3 [&_[role=slider]]:cursor-default" /></div></TooltipTrigger><TooltipContent><p className="text-xs">{t('coffee.signInToRate')}</p></TooltipContent></Tooltip></TooltipProvider>
        )}
      </div>
      <p className={`text-sm font-medium ${matchColor}`}>{getTribePhrase(t, tribe, displayScore)}</p>
      {scanMeta.matchReasons.length > 0 && (
        <Collapsible open={isReasonsOpen} onOpenChange={setIsReasonsOpen}>
          <CollapsibleTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full pt-2 border-t border-border">
            {isPositiveMatch ? t('coffee.whyMatches') : t('coffee.whyNotMatches')}
            {isReasonsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <ul className="space-y-1">
              {scanMeta.matchReasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  {isPositiveMatch ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-secondary" /> : <XCircle className="h-4 w-4 shrink-0 mt-0.5 text-destructive" />}
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )}
      <div className="text-xs text-muted-foreground pt-2 border-t border-border">{t('coffee.aiConfidence')}: {Math.round(scanMeta.aiConfidence * 100)}%</div>
    </div>
  );
}
