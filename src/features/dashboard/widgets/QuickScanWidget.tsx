import { Link } from "react-router-dom";
import { ScanLine } from "lucide-react";
import { useLanguage } from "@/contexts/language";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/app";
import type { WidgetComponentProps } from "./types";
import { WidgetCategoryTag } from "./WidgetCategoryTag";

export function QuickScanWidget({ widget }: WidgetComponentProps) {
  const { t } = useLanguage();

  return (
    <div className="relative h-full overflow-hidden rounded-lg border-4 border-border bg-card p-0 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="font-bangers text-lg flex items-center gap-2">
          <ScanLine className="h-5 w-5 text-secondary" />
          {t("widgets.scanCoffee")}
        </h3>
        <WidgetCategoryTag label={t("widgets.categoryExperience")} />
      </div>
      <div className="px-5 pb-5 flex flex-col items-center justify-center py-4">
        <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center border-4 border-border">
          <ScanLine className="h-8 w-8 text-secondary" />
        </div>
        <p className="text-sm text-muted-foreground text-center mt-3">{t("widgets.discoverWithAI")}</p>
        <Button asChild variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-4">
          <Link to={ROUTES.scanner}>{t("widgets.startScanning")}</Link>
        </Button>
      </div>
    </div>
  );
}
