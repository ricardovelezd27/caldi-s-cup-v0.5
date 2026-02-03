import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import type { WidgetComponentProps } from "./types";

const LEVEL_CONFIG = {
  beginner: {
    label: "Beginner",
    progress: 25,
    description: "Just starting your coffee journey",
    nextLevel: "intermediate",
    toNext: "Brew 20 more cups to level up",
  },
  intermediate: {
    label: "Intermediate",
    progress: 60,
    description: "Developing your palate",
    nextLevel: "expert",
    toNext: "Try 5 new origins to level up",
  },
  expert: {
    label: "Expert",
    progress: 100,
    description: "A true coffee connoisseur",
    nextLevel: null,
    toNext: "You've mastered the art!",
  },
} as const;

export function BrewingLevelWidget({ widget }: WidgetComponentProps) {
  const { profile } = useAuth();
  const level = profile?.brewing_level ?? "beginner";
  const config = LEVEL_CONFIG[level];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="font-bangers text-xl tracking-wide flex items-center gap-2">
          <Award className="h-5 w-5 text-accent" />
          Brewing Level
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-bangers text-2xl text-accent">{config.label}</span>
          <span className="text-sm text-muted-foreground">{config.progress}%</span>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-muted rounded-full overflow-hidden border-2 border-border">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${config.progress}%` }}
          />
        </div>

        <p className="text-sm text-muted-foreground">{config.description}</p>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">{config.toNext}</p>
        </div>
      </CardContent>
    </Card>
  );
}
