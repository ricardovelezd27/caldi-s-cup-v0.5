import { MapPin, Award, BadgeCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Coffee } from "../types";
import { formatOrigin, getRoastLevelLabel } from "../types";

interface CoffeeInfoProps {
  coffee: Coffee;
  showVerifiedBadge?: boolean;
  isNewCoffee?: boolean;
}

export function CoffeeInfo({ coffee, showVerifiedBadge = true, isNewCoffee = false }: CoffeeInfoProps) {
  const origin = formatOrigin(
    coffee.originCountry,
    coffee.originRegion,
    coffee.originFarm
  );

  return (
    <div className="space-y-3">
      {/* Name and Brand */}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="font-bangers text-3xl md:text-4xl tracking-wide text-foreground">
            {coffee.name}
          </h1>
          {isNewCoffee && (
            <Badge className="bg-primary text-primary-foreground animate-pulse gap-1">
              <Sparkles className="h-3 w-3" />
              New Coffee Detected!
            </Badge>
          )}
          {showVerifiedBadge && coffee.isVerified && (
            <Badge variant="secondary" className="gap-1">
              <BadgeCheck className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>
        {coffee.brand && (
          <p className="text-lg text-muted-foreground font-medium">
            by {coffee.brand}
          </p>
        )}
      </div>

      {/* Origin */}
      {origin && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{origin}</span>
        </div>
      )}

      {/* Meta Badges */}
      <div className="flex flex-wrap gap-2">
        {coffee.roastLevel && (
          <Badge variant="outline">
            {getRoastLevelLabel(coffee.roastLevel)} Roast
          </Badge>
        )}
        {coffee.processingMethod && (
          <Badge variant="outline">{coffee.processingMethod}</Badge>
        )}
        {coffee.variety && (
          <Badge variant="outline">{coffee.variety}</Badge>
        )}
        {coffee.altitudeMeters && (
          <Badge variant="outline">{coffee.altitudeMeters.toLocaleString()}m</Badge>
        )}
      </div>

      {/* Awards */}
      {coffee.awards.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {coffee.awards.map((award, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              <Award className="h-3 w-3" />
              {award}
            </Badge>
          ))}
        </div>
      )}

      {/* Cupping Score */}
      {coffee.cuppingScore && (
        <div className="text-sm text-muted-foreground">
          Cupping Score: <span className="font-semibold text-foreground">{coffee.cuppingScore}</span>/100
        </div>
      )}
    </div>
  );
}
