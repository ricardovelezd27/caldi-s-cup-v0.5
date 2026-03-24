import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Package, ScanLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { InventoryModal } from "@/features/profile/components/InventoryModal";
import type { WidgetComponentProps } from "./types";
import { WidgetCategoryTag } from "./WidgetCategoryTag";

export function InventoryWidget({ widget }: WidgetComponentProps) {
  const { user } = useAuth();
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

  const { data: inventoryItems = [] } = useQuery({
    queryKey: ["inventory-preview", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("user_coffee_inventory")
        .select(`id, quantity_grams, coffee:coffees (id, name, brand, image_url)`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
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
            {totalCount > 0 ? `My Inventory (${totalCount})` : "My Inventory"}
          </h3>
          <WidgetCategoryTag label="Experience" />
        </div>
        <div className="px-5 pb-5">
          {inventoryItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground mb-3">No coffees in inventory</p>
              <Button asChild variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                <Link to="/scanner"><ScanLine className="h-4 w-4 mr-2" />Scan to add</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {inventoryItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded-lg border border-border bg-muted/30 text-center"
                >
                  {item.coffee?.image_url && (
                    <div className="w-12 h-12 mx-auto rounded border-2 border-border overflow-hidden mb-2">
                      <img src={item.coffee.image_url} alt={item.coffee?.name || "Coffee"} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p className="text-xs font-medium truncate">{item.coffee?.name || "Unknown"}</p>
                  {item.quantity_grams && <p className="text-xs text-muted-foreground">{item.quantity_grams}g</p>}
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground text-center mt-3">View all →</p>
        </div>
      </div>
      <InventoryModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
