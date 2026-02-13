import { Badge } from "@/components/ui/badge";
import type { Coffee } from "../types";

interface CoffeeFlavorNotesProps {
  coffee: Coffee;
}

export function CoffeeFlavorNotes({ coffee }: CoffeeFlavorNotesProps) {
  if (!coffee.flavorNotes || coffee.flavorNotes.length === 0) {
    return (
      <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card space-y-3">
        <h3 className="font-bangers text-lg text-foreground tracking-wide">
          Flavor Notes
        </h3>
        <p className="text-sm text-muted-foreground italic">No flavor notes detected for this coffee.</p>
      </div>
    );
  }

  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card space-y-3">
      <h3 className="font-bangers text-lg text-foreground tracking-wide">
        Flavor Notes
      </h3>
      <div className="flex flex-wrap gap-2">
        {coffee.flavorNotes.map((note, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="text-sm capitalize"
          >
            {note}
          </Badge>
        ))}
      </div>
    </div>
  );
}
