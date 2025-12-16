import { Slider } from "@/components/ui/slider";

interface AttributeSliderProps {
  label: string;
  value: number; // 1-5 scale
  leftLabel: string;
  rightLabel: string;
}

export const AttributeSlider = ({ 
  label, 
  value, 
  leftLabel, 
  rightLabel 
}: AttributeSliderProps) => {
  // Convert 1-5 scale to 0-100 for slider
  const sliderValue = ((value - 1) / 4) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground capitalize">
          {value <= 2 ? leftLabel : value >= 4 ? rightLabel : "Balanced"}
        </span>
      </div>
      
      <div className="relative">
        <Slider
          value={[sliderValue]}
          max={100}
          step={1}
          disabled
          className="cursor-default pointer-events-none"
          aria-label={`${label}: ${value} out of 5`}
        />
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
};
