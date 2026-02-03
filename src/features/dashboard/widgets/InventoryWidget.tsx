import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ScanLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import type { WidgetComponentProps } from "./types";

export function InventoryWidget({ widget }: WidgetComponentProps) {
  const { user } = useAuth();

  const { data: inventoryItems = [] } = useQuery({
    queryKey: ["inventory-preview", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("user_coffee_inventory")
        .select(`
          id,
          quantity_grams,
          coffee:coffees (
            id,
            name,
            brand,
            image_url
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="font-bangers text-xl tracking-wide flex items-center gap-2">
          <Package className="h-5 w-5 text-accent" />
          My Inventory
        </CardTitle>
      </CardHeader>
      <CardContent>
        {inventoryItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Package className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground mb-3">No coffees in inventory</p>
            <Button asChild variant="outline" size="sm">
              <Link to="/scanner">
                <ScanLine className="h-4 w-4 mr-2" />
                Scan to add
              </Link>
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
                    <img 
                      src={item.coffee.image_url} 
                      alt={item.coffee?.name || "Coffee"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-xs font-medium truncate">
                  {item.coffee?.name || "Unknown"}
                </p>
                {item.quantity_grams && (
                  <p className="text-xs text-muted-foreground">
                    {item.quantity_grams}g
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
