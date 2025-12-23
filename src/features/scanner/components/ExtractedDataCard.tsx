import { MapPin, Flame, Leaf, Mountain, Globe, TreePine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ScannedCoffee, RoastLevelNumeric } from "../types/scanner";
import { getRoastLevelLabel, formatAltitude, formatOrigin } from "../types/scanner";

interface ExtractedDataCardProps {
  data: ScannedCoffee;
}

// Roast level visual indicator component
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

export function ExtractedDataCard({ data }: ExtractedDataCardProps) {
  // Build structured origin display
  const structuredOrigin = formatOrigin(
    data.originCountry,
    data.originRegion,
    data.originFarm
  );
  
  // Use structured origin if available, fallback to legacy
  const displayOrigin = structuredOrigin || data.origin;
  
  // Use structured altitude if available, fallback to legacy
  const displayAltitude = data.altitudeMeters 
    ? formatAltitude(data.altitudeMeters) 
    : data.altitude;

  // Build details array with structured data preference
  const details = [
    { 
      icon: Globe, 
      label: "Country", 
      value: data.originCountry,
      show: !!data.originCountry 
    },
    { 
      icon: MapPin, 
      label: "Region", 
      value: data.originRegion,
      show: !!data.originRegion 
    },
    { 
      icon: TreePine, 
      label: "Farm", 
      value: data.originFarm,
      show: !!data.originFarm 
    },
    { 
      icon: Leaf, 
      label: "Process", 
      value: data.processingMethod,
      show: !!data.processingMethod 
    },
    { 
      icon: Mountain, 
      label: "Altitude", 
      value: displayAltitude,
      show: !!displayAltitude 
    },
  ].filter((d) => d.show);

  // Fallback to legacy origin if no structured data
  const showLegacyOrigin = !data.originCountry && !data.originRegion && data.origin;

  return (
    <Card className="border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))] h-full">
      {/* Coffee Image */}
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={data.imageUrl}
          alt={data.coffeeName || "Scanned coffee"}
          className="w-full h-full object-cover"
        />
      </div>

      <CardHeader className="pb-2">
        <div className="space-y-1">
          {data.brand && (
            <p className="text-sm text-muted-foreground font-medium">
              {data.brand}
            </p>
          )}
          <CardTitle className="font-bangers text-2xl">
            {data.coffeeName || "Unknown Coffee"}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Roast Level with Visual Indicator */}
        {(data.roastLevelNumeric || data.roastLevel) && (
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm">
              <span className="text-muted-foreground">Roast: </span>
              {data.roastLevelNumeric ? (
                <RoastLevelIndicator level={data.roastLevelNumeric} />
              ) : (
                <span className="font-medium">{data.roastLevel}</span>
              )}
            </div>
          </div>
        )}

        {/* Legacy Origin (if no structured data) */}
        {showLegacyOrigin && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm">
              <span className="text-muted-foreground">Origin: </span>
              <span className="font-medium">{data.origin}</span>
            </div>
          </div>
        )}

        {/* Structured Details Grid */}
        {details.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="text-sm min-w-0">
                  <span className="text-muted-foreground">{label}: </span>
                  <span className="font-medium truncate">{value}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Variety */}
        {data.variety && (
          <div className="pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Variety: </span>
            <Badge variant="secondary" className="font-normal">
              {data.variety}
            </Badge>
          </div>
        )}

        {/* Awards */}
        {data.awards && data.awards.length > 0 && (
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Awards & Certifications</p>
            <div className="flex flex-wrap gap-1">
              {data.awards.map((award, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {award}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Cupping Score */}
        {data.cuppingScore && (
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Cupping Score</span>
            <span className="font-bangers text-xl text-primary">
              {data.cuppingScore}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
