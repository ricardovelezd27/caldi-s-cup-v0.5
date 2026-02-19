import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Coffee } from "../types";
import type { UserCoffeeRating } from "../hooks/useUserCoffeeRating";
import { useLanguage } from "@/contexts/language";

interface AttributeSliderProps { label: string; aiValue: number | null; userValue: number | null; leftLabel: string; rightLabel: string; isAuthenticated: boolean; onUserChange?: (value: number) => void; noDataLabel: string; signInLabel: string; }

function AttributeSlider({ label, aiValue, userValue, leftLabel, rightLabel, isAuthenticated, onUserChange, noDataLabel, signInLabel }: AttributeSliderProps) {
  if (aiValue === null && userValue === null) {
    return (<div className="space-y-2"><div className="flex justify-between items-center text-sm"><span className="font-medium text-foreground">{label}</span><span className="text-muted-foreground italic text-xs">{noDataLabel}</span></div></div>);
  }
  const displayValue = userValue ?? aiValue ?? 0;
  const hasDifference = userValue !== null && aiValue !== null && userValue !== aiValue;
  const aiMarkerPercent = aiValue !== null ? ((aiValue - 1) / 4) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground text-xs">
          {hasDifference ? (<><span className="text-primary">AI: {aiValue}/5</span><span className="mx-1">|</span><span className="text-secondary">You: {userValue}/5</span></>) : (<span>{displayValue}/5</span>)}
        </span>
      </div>
      <div className="relative">
        {aiValue !== null && hasDifference && (<div className="absolute top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-primary border-2 border-primary-foreground pointer-events-none" style={{ left: `calc(${aiMarkerPercent}% - 10px)` }} title={`AI: ${aiValue}/5`} />)}
        {isAuthenticated ? (
          <Slider value={[displayValue]} min={1} max={5} step={1} onValueChange={([v]) => onUserChange?.(v)} className="[&_[role=slider]]:cursor-grab [&_[role=slider]]:active:cursor-grabbing [&_[role=slider]]:border-secondary [&_[role=slider]]:bg-secondary" />
        ) : (
          <TooltipProvider><Tooltip><TooltipTrigger asChild><div><Slider value={[displayValue]} min={1} max={5} step={1} disabled className="[&_[role=slider]]:cursor-default" /></div></TooltipTrigger><TooltipContent><p className="text-xs">{signInLabel}</p></TooltipContent></Tooltip></TooltipProvider>
        )}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground"><span>{leftLabel}</span><span>{rightLabel}</span></div>
    </div>
  );
}

interface CoffeeAttributesProps { coffee: Coffee; rating?: UserCoffeeRating; isAuthenticated?: boolean; onRatingChange?: (field: keyof UserCoffeeRating, value: number) => void; }

export function CoffeeAttributes({ coffee, rating, isAuthenticated = false, onRatingChange }: CoffeeAttributesProps) {
  const { t } = useLanguage();
  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card space-y-4">
      <h3 className="font-bangers text-lg text-foreground tracking-wide">{t('coffee.attributes')}</h3>
      {isAuthenticated && (<p className="text-xs text-muted-foreground italic -mt-2">{t('coffee.dragSliders')}</p>)}
      <AttributeSlider label={t('coffee.body')} aiValue={coffee.bodyScore} userValue={rating?.userBodyScore ?? null} leftLabel={t('coffee.light')} rightLabel={t('coffee.full')} isAuthenticated={isAuthenticated} onUserChange={(v) => onRatingChange?.("userBodyScore", v)} noDataLabel={t('coffee.noData')} signInLabel={t('coffee.signInToRate')} />
      <AttributeSlider label={t('coffee.acidity')} aiValue={coffee.acidityScore} userValue={rating?.userAcidityScore ?? null} leftLabel={t('coffee.subtle')} rightLabel={t('coffee.bright')} isAuthenticated={isAuthenticated} onUserChange={(v) => onRatingChange?.("userAcidityScore", v)} noDataLabel={t('coffee.noData')} signInLabel={t('coffee.signInToRate')} />
      <AttributeSlider label={t('coffee.sweetness')} aiValue={coffee.sweetnessScore} userValue={rating?.userSweetnessScore ?? null} leftLabel={t('coffee.dry')} rightLabel={t('coffee.sweet')} isAuthenticated={isAuthenticated} onUserChange={(v) => onRatingChange?.("userSweetnessScore", v)} noDataLabel={t('coffee.noData')} signInLabel={t('coffee.signInToRate')} />
    </div>
  );
}
