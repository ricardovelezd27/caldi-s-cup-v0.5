import type { Coffee } from "../types";

interface CoffeeDescriptionProps {
  coffee: Coffee;
}

export function CoffeeDescription({ coffee }: CoffeeDescriptionProps) {
  if (!coffee.description) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="font-bangers text-lg text-foreground tracking-wide">
        About This Coffee
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {coffee.description}
      </p>
    </div>
  );
}
