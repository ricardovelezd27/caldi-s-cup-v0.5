import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JargonBuster } from "./JargonBuster";
import type { ScannedCoffee } from "../types/scanner";

interface EnrichedDataCardProps {
  data: ScannedCoffee;
}

function AttributeBar({ label, value, max = 5 }: { label: string; value: number | null; max?: number }) {
  if (value === null) return null;
  
  const percentage = (value / max) * 100;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}/{max}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden border border-border">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function EnrichedDataCard({ data }: EnrichedDataCardProps) {
  return (
    <Card className="border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))] h-full">
      <CardHeader>
        <CardTitle className="font-bangers text-xl">Coffee Profile</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Flavor Profile Bars */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-foreground">Flavor Profile</h4>
          <AttributeBar label="Acidity" value={data.acidityScore} />
          <AttributeBar label="Body" value={data.bodyScore} />
          <AttributeBar label="Sweetness" value={data.sweetnessScore} />
        </div>

        {/* Flavor Notes */}
        {data.flavorNotes && data.flavorNotes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-foreground">Tasting Notes</h4>
            <div className="flex flex-wrap gap-2">
              {data.flavorNotes.map((note, i) => (
                <Badge 
                  key={i} 
                  variant="secondary"
                  className="bg-secondary/10 text-secondary border-secondary/30"
                >
                  {note}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Brand Story */}
        {data.brandStory && (
          <div className="space-y-2 pt-2 border-t border-border">
            <h4 className="text-sm font-bold text-foreground">About the Roaster</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.brandStory}
            </p>
          </div>
        )}

        {/* Jargon Buster */}
        {data.jargonExplanations && Object.keys(data.jargonExplanations).length > 0 && (
          <div className="pt-2 border-t border-border">
            <JargonBuster explanations={data.jargonExplanations} />
          </div>
        )}

        {/* AI Confidence */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">AI Confidence</span>
            <span className={`font-medium ${
              data.aiConfidence >= 0.8 ? "text-secondary" :
              data.aiConfidence >= 0.5 ? "text-primary" :
              "text-accent"
            }`}>
              {Math.round(data.aiConfidence * 100)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
