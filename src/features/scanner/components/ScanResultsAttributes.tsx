import { AttributeSlider } from "@/features/marketplace/components/AttributeSlider";
import type { ScannedCoffee } from "../types/scanner";

interface ScanResultsAttributesProps {
  data: ScannedCoffee;
}

export function ScanResultsAttributes({ data }: ScanResultsAttributesProps) {
  const hasAttributes = data.bodyScore || data.acidityScore || data.sweetnessScore;

  if (!hasAttributes) {
    return null;
  }

  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card space-y-4">
      <h3 className="font-bangers text-lg text-foreground tracking-wide">
        Coffee Attributes
      </h3>
      
      {data.bodyScore && (
        <AttributeSlider
          label="Body"
          value={data.bodyScore}
          leftLabel="Light"
          rightLabel="Full"
        />
      )}
      
      {data.acidityScore && (
        <AttributeSlider
          label="Acidity"
          value={data.acidityScore}
          leftLabel="Subtle"
          rightLabel="Bright"
        />
      )}
      
      {data.sweetnessScore && (
        <AttributeSlider
          label="Sweetness"
          value={data.sweetnessScore}
          leftLabel="Dry"
          rightLabel="Sweet"
        />
      )}
    </div>
  );
}
