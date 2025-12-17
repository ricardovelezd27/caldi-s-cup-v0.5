import { MapPin, Flame, Leaf, Mountain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ScannedCoffee } from "../types/scanner";

interface ExtractedDataCardProps {
  data: ScannedCoffee;
}

export function ExtractedDataCard({ data }: ExtractedDataCardProps) {
  const details = [
    { icon: MapPin, label: "Origin", value: data.origin },
    { icon: Flame, label: "Roast", value: data.roastLevel },
    { icon: Leaf, label: "Process", value: data.processingMethod },
    { icon: Mountain, label: "Altitude", value: data.altitude },
  ].filter((d) => d.value);

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
        {/* Quick Details */}
        <div className="grid grid-cols-2 gap-2">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="text-muted-foreground">{label}: </span>
                <span className="font-medium">{value}</span>
              </div>
            </div>
          ))}
        </div>

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
