import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { History, ScanLine } from "lucide-react";
import { useLanguage } from "@/contexts/language";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import type { WidgetComponentProps } from "./types";
import { WidgetCategoryTag } from "./WidgetCategoryTag";

export function RecentScansWidget({ widget }: WidgetComponentProps) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const { data: scanCount = 0 } = useQuery({
    queryKey: ["scan-count", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count, error } = await supabase
        .from("coffee_scans")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="relative h-full overflow-hidden rounded-lg border-4 border-border bg-card p-0 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="font-bangers text-lg flex items-center gap-2">
          <History className="h-5 w-5 text-secondary" />
          {t("widgets.recentScans")}
        </h3>
        <WidgetCategoryTag label={t("widgets.categoryExperience")} />
      </div>
      <div className="px-5 pb-5 flex flex-col items-center justify-center py-4">
        <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center border-4 border-border">
          {scanCount > 0 ? (
            <span className="font-bangers text-2xl text-foreground">{scanCount}</span>
          ) : (
            <ScanLine className="h-8 w-8 text-secondary" />
          )}
        </div>
        <p className="text-muted-foreground text-center mt-3">
          {scanCount > 0
            ? `${scanCount} ${t("widgets.recentScans").toLowerCase()}`
            : t("widgets.noScansYet")}
        </p>
        <Button asChild variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-4">
          <Link to="/scanner">{scanCount > 0 ? t("widgets.scanMore") : t("widgets.startScanning")}</Link>
        </Button>
      </div>
    </div>
  );
}
