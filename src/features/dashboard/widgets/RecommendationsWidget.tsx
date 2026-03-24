import { Sparkles } from "lucide-react";
import type { WidgetComponentProps } from "./types";
import { WidgetCategoryTag } from "./WidgetCategoryTag";

export function RecommendationsWidget({ widget }: WidgetComponentProps) {
  return (
    <div className="relative h-full overflow-hidden rounded-lg border-4 border-border bg-card p-0 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="font-bangers text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          For You
        </h3>
        <WidgetCategoryTag label="AI" />
      </div>
      <div className="px-5 pb-5">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">AI recommendations coming soon!</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Scan more coffees to get personalized suggestions</p>
        </div>
      </div>
    </div>
  );
}
