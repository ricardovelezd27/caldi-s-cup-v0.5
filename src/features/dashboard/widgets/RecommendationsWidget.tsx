import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { WidgetComponentProps } from "./types";

export function RecommendationsWidget({ widget }: WidgetComponentProps) {
  // Placeholder for future AI recommendations
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="font-bangers text-xl tracking-wide flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          For You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">
            AI recommendations coming soon!
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Scan more coffees to get personalized suggestions
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
