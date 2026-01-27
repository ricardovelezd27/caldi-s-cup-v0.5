import { Badge } from "@/components/ui/badge";
import type { ScannedCoffee } from "../types/scanner";

interface ScanResultsFlavorNotesProps {
  data: ScannedCoffee;
}

export function ScanResultsFlavorNotes({ data }: ScanResultsFlavorNotesProps) {
  if (!data.flavorNotes || data.flavorNotes.length === 0) {
    return null;
  }

  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card">
      <h3 className="font-bangers text-lg text-foreground mb-3 tracking-wide">
        Flavor Notes
      </h3>
      <div className="flex flex-wrap gap-2">
        {data.flavorNotes.map((note, index) => (
          <Badge 
            key={index} 
            variant="outline" 
            className="px-3 py-1 text-sm font-medium capitalize"
          >
            {note}
          </Badge>
        ))}
      </div>
    </div>
  );
}
