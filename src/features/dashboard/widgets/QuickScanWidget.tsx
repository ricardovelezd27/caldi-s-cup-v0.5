import { Link } from "react-router-dom";
import { ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/app";
import type { WidgetComponentProps } from "./types";
import { WidgetCategoryTag } from "./WidgetCategoryTag";

export function QuickScanWidget({ widget }: WidgetComponentProps) {
  return (
    <div className="relative h-full overflow-hidden rounded-lg border-4 border-border bg-gradient-to-br from-primary/20 to-accent/10 p-0 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
      <div className="absolute top-3 right-3 z-10">
        <WidgetCategoryTag label="Experience" />
      </div>
      <div className="flex flex-col items-center justify-center h-full py-6 gap-4 px-5">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-4 border-border">
          <ScanLine className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center">
          <h3 className="font-bangers text-xl tracking-wide text-foreground">Scan a Coffee</h3>
          <p className="text-sm text-muted-foreground mt-1">Discover coffee profiles with AI</p>
        </div>
        <Button asChild variant="ghost" size="sm" className="w-full">
          <Link to={ROUTES.scanner}>Start scanning →</Link>
        </Button>
      </div>
    </div>
  );
}
