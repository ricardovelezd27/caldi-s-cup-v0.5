import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { BrewingLevel } from "../types/dashboard";

interface BrewingLevelCardProps {
  level: BrewingLevel;
}

const levelConfig: Record<BrewingLevel, { label: string; progress: number; color: string; nextLevel?: string }> = {
  beginner: {
    label: "Beginner Barista",
    progress: 25,
    color: "hsl(var(--secondary))",
    nextLevel: "Intermediate",
  },
  intermediate: {
    label: "Home Barista",
    progress: 60,
    color: "hsl(var(--primary))",
    nextLevel: "Expert",
  },
  expert: {
    label: "Coffee Master",
    progress: 100,
    color: "hsl(var(--accent))",
  },
};

export function BrewingLevelCard({ level }: BrewingLevelCardProps) {
  const config = levelConfig[level];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="font-bangers text-xl tracking-wide flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Brewing Level
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Level Display */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground">{config.label}</span>
          <span className="text-sm text-muted-foreground">{config.progress}%</span>
        </div>

        {/* Progress Bar */}
        <Progress 
          value={config.progress} 
          className="h-3"
        />

        {/* Next Level Info */}
        {config.nextLevel ? (
          <p className="text-xs text-muted-foreground">
            Keep brewing to reach <span className="font-medium">{config.nextLevel}</span> level!
          </p>
        ) : (
          <p className="text-xs text-secondary font-medium">
            🏆 You've mastered the art of coffee!
          </p>
        )}

        {/* Level Indicators */}
        <div className="flex justify-between text-xs text-muted-foreground pt-2">
          <span className={level === "beginner" ? "text-secondary font-medium" : ""}>Beginner</span>
          <span className={level === "intermediate" ? "text-primary font-medium" : ""}>Intermediate</span>
          <span className={level === "expert" ? "text-accent font-medium" : ""}>Expert</span>
        </div>
      </CardContent>
    </Card>
  );
}
