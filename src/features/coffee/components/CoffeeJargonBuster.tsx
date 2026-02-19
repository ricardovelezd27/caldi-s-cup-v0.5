import { HelpCircle } from "lucide-react";
import type { CoffeeScanMeta } from "../types";
import { useLanguage } from "@/contexts/language";

interface CoffeeJargonBusterProps { scanMeta: CoffeeScanMeta; }

export function CoffeeJargonBuster({ scanMeta }: CoffeeJargonBusterProps) {
  const { t } = useLanguage();
  const jargonEntries = Object.entries(scanMeta.jargonExplanations);
  if (jargonEntries.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-primary" />
        <span className="font-bangers text-lg tracking-wide">{t('coffee.jargonBuster')}</span>
      </div>
      <div className="space-y-3">
        {jargonEntries.map(([term, explanation]) => (
          <div key={term} className="space-y-1">
            <dt className="font-medium text-foreground capitalize">{term}</dt>
            <dd className="text-sm text-muted-foreground pl-4 border-l-2 border-secondary">{explanation}</dd>
          </div>
        ))}
      </div>
    </div>
  );
}
