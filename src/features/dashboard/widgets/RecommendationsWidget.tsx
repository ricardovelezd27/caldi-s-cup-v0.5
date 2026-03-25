import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/language";
import { Button } from "@/components/ui/button";
import type { WidgetComponentProps } from "./types";
import { WidgetCategoryTag } from "./WidgetCategoryTag";

export function RecommendationsWidget({ widget }: WidgetComponentProps) {
  const { t } = useLanguage();

  return (
    <div className="relative h-full overflow-hidden rounded-lg border-4 border-border bg-card p-0 shadow-[4px_4px_0px_0px_hsl(var(--border))] flex flex-col">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="font-bangers text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {t("widgets.forYou")}
        </h3>
        <WidgetCategoryTag label={t("widgets.categoryAI")} />
      </div>
      <div className="px-5 pb-5 flex flex-col items-center flex-1">
        <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground text-center">{t("widgets.aiComingSoon")}</p>
        <p className="text-sm text-muted-foreground/70 mt-1 text-center">{t("widgets.scanMoreForRecs")}</p>
        <Button asChild variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-auto">
          <Link to="/marketplace">{t("widgets.browseMarketplace")}</Link>
        </Button>
      </div>
    </div>
  );
}
