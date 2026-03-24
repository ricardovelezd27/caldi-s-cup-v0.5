import { Link } from "react-router-dom";
import { ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants/app";
import type { WidgetComponentProps } from "./types";
import { WidgetCategoryTag } from "./WidgetCategoryTag";

export function QuickScanWidget({ widget }: WidgetComponentProps) {
  return (
    <Card className="h-full bg-gradient-to-br from-primary/20 to-accent/10 relative">
      <div className="absolute top-3 right-3 z-10">
        <WidgetCategoryTag label="Experience" />
      </div>
      <CardContent className="flex flex-col items-center justify-center h-full py-6 gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-4 border-border">
          <ScanLine className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center">
          <h3 className="font-bangers text-xl tracking-wide text-foreground">
            Scan a Coffee
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Discover coffee profiles with AI
          </p>
        </div>
        <Button asChild>
          <Link to={ROUTES.scanner}>Start Scanning</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
