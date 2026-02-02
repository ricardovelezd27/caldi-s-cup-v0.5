import { Slider } from "@/components/ui/slider";
import type { Coffee } from "../types";

interface AttributeSliderProps {
  label: string;
  value: number | null;
  leftLabel: string;
  rightLabel: string;
}

function AttributeSlider({ label, value, leftLabel, rightLabel }: AttributeSliderProps) {
  const displayValue = value ?? 3; // Default to middle if null
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">{displayValue}/5</span>
      </div>
      <Slider
        value={[displayValue]}
        min={1}
        max={5}
        step={1}
        disabled
        className="[&_[role=slider]]:cursor-default"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}

interface CoffeeAttributesProps {
  coffee: Coffee;
}

export function CoffeeAttributes({ coffee }: CoffeeAttributesProps) {
  const hasAttributes = 
    coffee.bodyScore !== null || 
    coffee.acidityScore !== null || 
    coffee.sweetnessScore !== null;

  if (!hasAttributes) {
    return null;
  }

  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card space-y-4">
      <h3 className="font-bangers text-lg text-foreground tracking-wide">
        Coffee Attributes
      </h3>
      <AttributeSlider
        label="Body"
        value={coffee.bodyScore}
        leftLabel="Light"
        rightLabel="Full"
      />
      <AttributeSlider
        label="Acidity"
        value={coffee.acidityScore}
        leftLabel="Subtle"
        rightLabel="Bright"
      />
      <AttributeSlider
        label="Sweetness"
        value={coffee.sweetnessScore}
        leftLabel="Dry"
        rightLabel="Sweet"
      />
    </div>
  );
}
