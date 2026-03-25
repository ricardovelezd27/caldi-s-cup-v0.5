import { Link } from "react-router-dom";
import { Coffee } from "lucide-react";
import { useLanguage } from "@/contexts/language";
import { useDashboardData } from "../hooks/useDashboardData";
import { Button } from "@/components/ui/button";
import type { WidgetComponentProps } from "./types";
import { WidgetCategoryTag } from "./WidgetCategoryTag";

export function RecentBrewsWidget({ widget }: WidgetComponentProps) {
  const { t } = useLanguage();
  const { recentBrews } = useDashboardData();
  const count = recentBrews.length;

  return (
    <div className="relative h-full overflow-hidden rounded-lg border-4 border-border bg-card p-0 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="font-bangers text-lg flex items-center gap-2">
          <Coffee className="h-5 w-5 text-primary" />
          {t("widgets.recentBrews")}
        </h3>
        <WidgetCategoryTag label={t("widgets.categoryExperience")} />
      </div>
      <div className="px-5 pb-5 flex flex-col items-center justify-center py-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-4 border-border">
          {count > 0 ? (
            <span className="font-bangers text-2xl text-foreground">{count}</span>
          ) : (
            <Coffee className="h-8 w-8 text-primary" />
          )}
        </div>
        <p className="text-muted-foreground text-center mt-3">
          {count > 0
            ? `${count} ${t("widgets.recentBrews").toLowerCase()}`
            : t("widgets.noBrewsYet")}
        </p>
        {count === 0 && (
          <p className="text-sm text-muted-foreground/70 mt-1 text-center">{t("widgets.startBrewing")}</p>
        )}
        <Button asChild variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-4">
          <Link to="/recipes">{t("widgets.viewBrews")}</Link>
        </Button>
      </div>
    </div>
  );
}
