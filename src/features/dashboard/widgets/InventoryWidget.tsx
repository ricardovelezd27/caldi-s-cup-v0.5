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

  const { data: inventoryItems = [] } = useQuery({
    queryKey: ["inventory-preview", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("user_coffee_inventory")
        .select("id, quantity_grams, coffees(name, brand)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user?.id,
  });

  const totalCount = inventoryItems.length;

  return (
    <>
      <div
        className="relative h-full overflow-hidden rounded-lg border-4 border-border bg-card p-0 shadow-[4px_4px_0px_0px_hsl(var(--border))] cursor-pointer transition-opacity hover:opacity-90 flex flex-col"
        onClick={() => setModalOpen(true)}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-bangers text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-accent" />
            {totalCount > 0 ? `${t("widgets.myInventory")} (${totalCount})` : t("widgets.myInventory")}
          </h3>
          <WidgetCategoryTag label={t("widgets.categoryExperience")} />
        </div>
        <div className="px-5 pb-5 flex flex-col items-center flex-1">
          {totalCount > 0 ? (
            <ul className="w-full space-y-2">
              {inventoryItems.map((item: any) => {
                const coffee = item.coffees as { name: string; brand: string | null } | null;
                return (
                  <li key={item.id} className="flex items-center gap-2 rounded-md border-2 border-border px-3 py-2">
                    <Package className="h-4 w-4 text-accent shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate text-foreground">{coffee?.name ?? "Unknown"}</p>
                      {coffee?.brand && <p className="text-xs text-muted-foreground truncate">{coffee.brand}</p>}
                    </div>
                    {item.quantity_grams && (
                      <span className="text-xs text-muted-foreground shrink-0">{item.quantity_grams}g</span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center border-4 border-border">
                <Package className="h-8 w-8 text-accent" />
              </div>
              <p className="text-muted-foreground text-center mt-3">{t("widgets.noInventory")}</p>
            </>
          )}
          <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-auto" onClick={(e) => e.stopPropagation()}>
            {t("widgets.viewAll")}
          </Button>
        </div>
      </div>
      <InventoryModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
