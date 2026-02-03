import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

interface InventoryItem {
  id: string;
  coffeeId: string;
  quantityGrams: number | null;
  purchaseDate: string | null;
  openedDate: string | null;
  notes: string | null;
}

export function useInventory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: inventoryItems = [], isLoading } = useQuery({
    queryKey: ["inventory", user?.id],
    queryFn: async (): Promise<InventoryItem[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("user_coffee_inventory")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data.map((item) => ({
        id: item.id,
        coffeeId: item.coffee_id,
        quantityGrams: item.quantity_grams,
        purchaseDate: item.purchase_date,
        openedDate: item.opened_date,
        notes: item.notes,
      }));
    },
    enabled: !!user?.id,
  });

  const inventoryIds = inventoryItems.map((i) => i.coffeeId);

  const addMutation = useMutation({
    mutationFn: async (coffeeId: string, data?: Partial<Omit<InventoryItem, "id" | "coffeeId">>) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_coffee_inventory")
        .insert({
          user_id: user.id,
          coffee_id: coffeeId,
          quantity_grams: data?.quantityGrams ?? null,
          purchase_date: data?.purchaseDate ?? null,
          opened_date: data?.openedDate ?? null,
          notes: data?.notes ?? null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", user?.id] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (inventoryId: string) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_coffee_inventory")
        .delete()
        .eq("id", inventoryId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", user?.id] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ inventoryId, data }: { inventoryId: string; data: Partial<InventoryItem> }) => {
      const { error } = await supabase
        .from("user_coffee_inventory")
        .update({
          quantity_grams: data.quantityGrams,
          purchase_date: data.purchaseDate,
          opened_date: data.openedDate,
          notes: data.notes,
        })
        .eq("id", inventoryId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", user?.id] });
    },
  });

  return {
    inventoryItems,
    inventoryIds,
    isLoading,
    isInInventory: (coffeeId: string) => inventoryIds.includes(coffeeId),
    getInventoryItem: (coffeeId: string) => inventoryItems.find((i) => i.coffeeId === coffeeId),
    addToInventory: addMutation.mutateAsync,
    removeFromInventory: removeMutation.mutateAsync,
    updateInventory: updateMutation.mutateAsync,
    isAddingInventory: addMutation.isPending,
    isRemovingInventory: removeMutation.isPending,
  };
}
