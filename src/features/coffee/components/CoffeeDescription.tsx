import type { Coffee } from "../types";
import type { CoffeeScanMeta } from "../types";
import { CoffeeJargonBuster } from "./CoffeeJargonBuster";

interface CoffeeDescriptionProps {
  coffee: Coffee;
  scanMeta?: CoffeeScanMeta;
}

export function CoffeeDescription({ coffee, scanMeta }: CoffeeDescriptionProps) {
  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card space-y-3">
      <h3 className="font-bangers text-lg text-foreground tracking-wide">
        About This Coffee
      </h3>
      {coffee.description ? (
        <p className="text-muted-foreground leading-relaxed text-sm">
          {coffee.description}
        </p>
      ) : (
        <p className="text-muted-foreground italic text-sm">No description available for this coffee.</p>
      )}

      {/* Jargon Buster always expanded inside the same card */}
      {scanMeta && Object.keys(scanMeta.jargonExplanations).length > 0 && (
        <div className="pt-2 border-t border-border">
          <CoffeeJargonBuster scanMeta={scanMeta} />
        </div>
      )}
    </div>
  );
}
