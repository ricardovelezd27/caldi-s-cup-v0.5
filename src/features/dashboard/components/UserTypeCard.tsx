import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTribeDefinition } from "@/features/quiz/data/tribes";
import type { CoffeeTribe } from "@/features/quiz/types/tribe";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserTypeCardProps {
  tribe: CoffeeTribe | null;
}

export function UserTypeCard({ tribe }: UserTypeCardProps) {
  if (!tribe) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="font-bangers text-xl tracking-wide">Your Coffee Tribe</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground text-center mb-4">
            Discover your coffee personality!
          </p>
          <Button asChild>
            <Link to="/quiz">Take the Quiz</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const tribeDef = getTribeDefinition(tribe);

  return (
    <Card className="h-full overflow-hidden">
      <div className={cn("h-2", tribeDef.bgClass.replace("/10", ""))} />
      <CardHeader className="pb-2">
        <CardTitle className="font-bangers text-xl tracking-wide">Your Coffee Tribe</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div 
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center text-3xl border-4 border-border",
              tribeDef.bgClass
            )}
          >
            {tribeDef.emoji}
          </div>
          <div>
            <h3 className={cn("font-bangers text-2xl tracking-wide", tribeDef.colorClass)}>
              {tribeDef.name}
            </h3>
            <p className="text-sm text-muted-foreground">{tribeDef.title}</p>
          </div>
        </div>
        
        <p className="text-sm text-foreground/80 mb-3">
          {tribeDef.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {tribeDef.values.slice(0, 3).map((value) => (
            <span
              key={value}
              className="text-xs px-2 py-1 rounded-full border border-border bg-muted"
            >
              {value}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
