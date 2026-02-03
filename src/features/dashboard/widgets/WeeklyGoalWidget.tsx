import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { useDashboardData } from "../hooks/useDashboardData";
import type { WidgetComponentProps } from "./types";

export function WeeklyGoalWidget({ widget }: WidgetComponentProps) {
  const { profile } = useAuth();
  const { weeklyBrewCount } = useDashboardData();
  
  const targetCount = profile?.weekly_goal_target ?? 10;
  const currentCount = weeklyBrewCount;
  const percentage = Math.min((currentCount / targetCount) * 100, 100);
  const isComplete = currentCount >= targetCount;

  // Calculate stroke dasharray for circular progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="font-bangers text-xl tracking-wide flex items-center gap-2">
          <Target className="h-5 w-5 text-secondary" />
          Weekly Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-4">
        {/* Circular Progress */}
        <div className="relative w-28 h-28">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={isComplete ? "hsl(var(--secondary))" : "hsl(var(--primary))"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-bangers text-2xl text-foreground">
              {currentCount}/{targetCount}
            </span>
            <span className="text-xs text-muted-foreground">cups</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-3 text-center">
          {isComplete ? (
            <span className="text-secondary font-medium">🎉 Goal reached!</span>
          ) : (
            <span>{targetCount - currentCount} more to go this week</span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
