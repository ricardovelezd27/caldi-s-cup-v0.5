import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { useLanguage } from "@/contexts/language";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { InventoryModal } from "@/features/profile/components/InventoryModal";
import { Button } from "@/components/ui/button";
import type { WidgetComponentProps } from "./types";
import { WidgetCategoryTag } from "./WidgetCategoryTag";

export function InventoryWidget({ widget }: WidgetComponentProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: totalCount = 0 } = useQuery({
    queryKey: ["inventory-count", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count, error } = await supabase
        .from("user_coffee_inventory")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user?.id,
  });

  return (
    <>
      <div
        className="relative h-full overflow-hidden rounded-lg border-4 border-border bg-card p-0 shadow-[4px_4px_0px_0px_hsl(var(--border))] cursor-pointer transition-opacity hover:opacity-90"
        onClick={() => setModalOpen(true)}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-bangers text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-accent" />
            {totalCount > 0 ? `${t("widgets.myInventory")} (${totalCount})` : t("widgets.myInventory")}
          </h3>
          <WidgetCategoryTag label={t("widgets.categoryExperience")} />
        </div>
        <div className="px-5 pb-5 flex flex-col items-center justify-center py-4">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center border-4 border-border">
            {totalCount > 0 ? (
              <span className="font-bangers text-2xl text-foreground">{totalCount}</span>
            ) : (
              <Package className="h-8 w-8 text-accent" />
            )}
          </div>
          <p className="text-muted-foreground text-center mt-3">
            {totalCount > 0
              ? `${totalCount} ${t("widgets.myInventory").toLowerCase()}`
              : t("widgets.noInventory")}
          </p>
          <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-4" onClick={(e) => e.stopPropagation()}>
            {t("widgets.viewAll")}
          </Button>
        </div>
      </div>
      <InventoryModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
