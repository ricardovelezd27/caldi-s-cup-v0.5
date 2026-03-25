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

  const { data: recentScans = [] } = useQuery({
    queryKey: ["recent-scans-preview", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("coffee_scans")
        .select("id, scanned_at, coffees(name, brand)")
        .eq("user_id", user.id)
        .order("scanned_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user?.id,
  });

  const scanCount = recentScans.length;

  return (
    <div className="relative h-full overflow-hidden rounded-lg border-4 border-border bg-card p-0 shadow-[4px_4px_0px_0px_hsl(var(--border))] flex flex-col">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="font-bangers text-lg flex items-center gap-2">
          <History className="h-5 w-5 text-secondary" />
          {t("widgets.recentScans")}
        </h3>
        <WidgetCategoryTag label={t("widgets.categoryExperience")} />
      </div>
      <div className="px-5 pb-5 flex flex-col items-center flex-1">
        {scanCount > 0 ? (
          <ul className="w-full space-y-2">
            {recentScans.map((scan: any) => {
              const coffee = scan.coffees as { name: string; brand: string | null } | null;
              return (
                <li key={scan.id} className="flex items-center gap-2 px-3 py-2">
                  <ScanLine className="h-4 w-4 text-secondary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate text-foreground">{coffee?.name ?? "Unknown"}</p>
                    {coffee?.brand && <p className="text-xs text-muted-foreground truncate">{coffee.brand}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center border-4 border-border">
              <ScanLine className="h-8 w-8 text-secondary" />
            </div>
            <p className="text-muted-foreground text-center mt-3">{t("widgets.noScansYet")}</p>
          </>
        )}
        <Button asChild variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-auto">
          <Link to="/scanner">{scanCount > 0 ? t("widgets.scanMore") : t("widgets.startScanning")}</Link>
        </Button>
      </div>
    </div>
  );
}
