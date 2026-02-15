import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Coffee } from "../types";
import type { UserCoffeeRating } from "../hooks/useUserCoffeeRating";

interface AttributeSliderProps {
  label: string;
  aiValue: number | null;
  userValue: number | null;
  leftLabel: string;
  rightLabel: string;
  isAuthenticated: boolean;
  onUserChange?: (value: number) => void;
}

function AttributeSlider({
  label,
  aiValue,
  userValue,
  leftLabel,
  rightLabel,
  isAuthenticated,
  onUserChange,
}: AttributeSliderProps) {
  if (aiValue === null && userValue === null) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-foreground">{label}</span>
          <span className="text-muted-foreground italic text-xs">No data available</span>
        </div>
      </div>
    );
  }

  const displayValue = userValue ?? aiValue ?? 0;
  const hasDifference = userValue !== null && aiValue !== null && userValue !== aiValue;

  // Calculate AI marker position percentage (1-5 scale → 0-100%)
  const aiMarkerPercent = aiValue !== null ? ((aiValue - 1) / 4) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground text-xs">
          {hasDifference ? (
            <>
              <span className="text-primary">AI: {aiValue}/5</span>
              <span className="mx-1">|</span>
              <span className="text-secondary">You: {userValue}/5</span>
            </>
          ) : (
            <span>{displayValue}/5</span>
          )}
        </span>
      </div>

      <div className="relative">
        {/* AI marker dot on the track — same size as thumb */}
        {aiValue !== null && hasDifference && (
          <div
            className="absolute top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-primary border-2 border-primary-foreground pointer-events-none"
            style={{ left: `calc(${aiMarkerPercent}% - 10px)` }}
            title={`AI: ${aiValue}/5`}
          />
        )}

        {isAuthenticated ? (
          <Slider
            value={[displayValue]}
            min={1}
            max={5}
            step={1}
            onValueChange={([v]) => onUserChange?.(v)}
            className="[&_[role=slider]]:cursor-grab [&_[role=slider]]:active:cursor-grabbing [&_[role=slider]]:border-secondary [&_[role=slider]]:bg-secondary"
          />
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Slider
                    value={[displayValue]}
                    min={1}
                    max={5}
                    step={1}
                    disabled
                    className="[&_[role=slider]]:cursor-default"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Sign in to rate this coffee</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}

interface CoffeeAttributesProps {
  coffee: Coffee;
  rating?: UserCoffeeRating;
  isAuthenticated?: boolean;
  onRatingChange?: (field: keyof UserCoffeeRating, value: number) => void;
}

export function CoffeeAttributes({
  coffee,
  rating,
  isAuthenticated = false,
  onRatingChange,
}: CoffeeAttributesProps) {
  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card space-y-4">
      <h3 className="font-bangers text-lg text-foreground tracking-wide">
        Coffee Attributes
      </h3>
      <AttributeSlider
        label="Body"
        aiValue={coffee.bodyScore}
        userValue={rating?.userBodyScore ?? null}
        leftLabel="Light"
        rightLabel="Full"
        isAuthenticated={isAuthenticated}
        onUserChange={(v) => onRatingChange?.("userBodyScore", v)}
      />
      <AttributeSlider
        label="Acidity"
        aiValue={coffee.acidityScore}
        userValue={rating?.userAcidityScore ?? null}
        leftLabel="Subtle"
        rightLabel="Bright"
        isAuthenticated={isAuthenticated}
        onUserChange={(v) => onRatingChange?.("userAcidityScore", v)}
      />
      <AttributeSlider
        label="Sweetness"
        aiValue={coffee.sweetnessScore}
        userValue={rating?.userSweetnessScore ?? null}
        leftLabel="Dry"
        rightLabel="Sweet"
        isAuthenticated={isAuthenticated}
        onUserChange={(v) => onRatingChange?.("userSweetnessScore", v)}
      />
    </div>
  );
}
