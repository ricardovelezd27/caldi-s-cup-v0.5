import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, Globe, TreePine } from "lucide-react";
import type { ScannedCoffee, RoastLevelNumeric } from "../types/scanner";
import { getRoastLevelLabel } from "../types/scanner";

interface ScanResultsInfoProps {
  data: ScannedCoffee;
}

function RoastLevelIndicator({ level }: { level: RoastLevelNumeric | null }) {
  if (!level) return null;
  
  const levelNum = parseInt(level, 10);
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-2 h-4 rounded-sm transition-colors ${
            i <= levelNum 
              ? "bg-accent" 
              : "bg-muted"
          }`}
          title={`Level ${i}`}
        />
      ))}
      <span className="ml-2 text-sm font-medium">
        {getRoastLevelLabel(level)}
      </span>
    </div>
  );
}

export function ScanResultsInfo({ data }: ScanResultsInfoProps) {
  // Build origin display
  const originParts = [
    data.originCountry,
    data.originRegion,
    data.originFarm
  ].filter(Boolean);
  const hasStructuredOrigin = originParts.length > 0;

  return (
    <div className="space-y-3">
      {/* Roast Level Badge */}
      {data.roastLevelNumeric && (
        <Badge 
          variant="secondary" 
          className="text-xs font-medium uppercase tracking-wide"
        >
          <RoastLevelIndicator level={data.roastLevelNumeric} />
        </Badge>
      )}

      {/* Coffee Name */}
      <h1 className="font-bangers text-3xl md:text-4xl text-foreground tracking-wide">
        {data.coffeeName || "Unknown Coffee"}
      </h1>

      {/* AI Confidence */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <span className="font-semibold text-foreground">
          {Math.round(data.aiConfidence * 100)}% AI Confidence
        </span>
      </div>

      {/* Brand / Roaster */}
      {data.brand && (
        <p className="text-sm text-muted-foreground">
          By{" "}
          <span className="text-secondary font-medium">
            {data.brand}
          </span>
        </p>
      )}

      {/* Structured Origin */}
      {hasStructuredOrigin && (
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground pt-2 border-t border-border">
          {data.originCountry && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>{data.originCountry}</span>
            </div>
          )}
          {data.originRegion && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{data.originRegion}</span>
            </div>
          )}
          {data.originFarm && (
            <div className="flex items-center gap-1">
              <TreePine className="w-4 h-4" />
              <span>{data.originFarm}</span>
            </div>
          )}
        </div>
      )}

      {/* Legacy origin fallback */}
      {!hasStructuredOrigin && data.origin && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border">
          <MapPin className="w-4 h-4" />
          <span>{data.origin}</span>
        </div>
      )}
    </div>
  );
}
