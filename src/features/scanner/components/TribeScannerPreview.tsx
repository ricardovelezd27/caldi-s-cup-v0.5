import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTribeDefinition } from "@/features/quiz/data/tribes";
import type { CoffeeTribe } from "@/features/quiz/types/tribe";

interface TribeScannerPreviewProps {
  tribe: CoffeeTribe;
}

export function TribeScannerPreview({ tribe }: TribeScannerPreviewProps) {
  const tribeData = getTribeDefinition(tribe);

  return (
    <Card className="border-4 border-border shadow-[4px_4px_0px_0px_hsl(var(--border))]">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Tribe Badge & Title */}
          <div className="flex items-center gap-3 md:border-r md:border-border md:pr-6">
            <span className="text-4xl">{tribeData.emoji}</span>
            <div>
              <h3 className="font-bangers text-xl text-foreground">{tribeData.name}</h3>
              <p className={`text-sm font-medium ${tribeData.colorClass}`}>{tribeData.title}</p>
            </div>
          </div>

          {/* What you're looking for */}
          <div className="flex-1 space-y-3">
            <h4 className="font-bold text-sm text-foreground">What you're looking for:</h4>
            <div className="flex flex-wrap gap-2">
              {tribeData.keywords.map((keyword) => (
                <Badge 
                  key={keyword} 
                  variant="secondary"
                  className="text-xs"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          {/* You'll likely love */}
          <div className="md:max-w-[200px] space-y-2">
            <h4 className="font-bold text-sm text-foreground">You'll likely love:</h4>
            <p className="text-xs text-muted-foreground">
              {getTribePrediction(tribe)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getTribePrediction(tribe: CoffeeTribe): string {
  const predictions: Record<CoffeeTribe, string> = {
    fox: "Coffees with awards, high cupping scores, and rare varietals from prestigious estates.",
    owl: "Clean, washed coffees with detailed traceability, high elevation, and precise processing data.",
    hummingbird: "Experimental naturals, funky fermentations, and unique flavor profiles that surprise.",
    bee: "Consistent, comforting roasts with familiar chocolate, nutty, and caramel notes.",
  };
  return predictions[tribe];
}
