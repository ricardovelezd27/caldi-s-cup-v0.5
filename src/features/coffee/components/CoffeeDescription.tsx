import type { Coffee } from "../types";
import type { CoffeeScanMeta } from "../types";
import { CoffeeJargonBuster } from "./CoffeeJargonBuster";
import { useLanguage } from "@/contexts/language";

interface CoffeeDescriptionProps { coffee: Coffee; scanMeta?: CoffeeScanMeta; }

export function CoffeeDescription({ coffee, scanMeta }: CoffeeDescriptionProps) {
  const { t } = useLanguage();
  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card space-y-3">
      <h3 className="font-bangers text-lg text-foreground tracking-wide">{t('coffee.aboutCoffee')}</h3>
      {coffee.description ? (<p className="text-muted-foreground leading-relaxed text-sm">{coffee.description}</p>) : (<p className="text-muted-foreground italic text-sm">{t('coffee.noDescription')}</p>)}
      {scanMeta && Object.keys(scanMeta.jargonExplanations).length > 0 && (<div className="pt-2 border-t border-border"><CoffeeJargonBuster scanMeta={scanMeta} /></div>)}
    </div>
  );
}
