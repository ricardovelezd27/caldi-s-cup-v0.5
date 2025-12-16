import { useCallback, useRef } from "react";
import { useCart } from "@/contexts/cart";
import { getItemOperationKey, type CartItemOperationState } from "@/types/cart";
import { toast } from "sonner";

/**
 * useOptimisticCart Hook
 * 
 * Provides optimistic update wrappers for cart operations.
 * Works with ANY backend - Shopify, Supabase, or custom API.
 * 
 * Features:
 * - Immediate UI feedback (no waiting for API)
 * - Per-item loading states
 * - Automatic rollback on error
 * - Debounced quantity updates (300ms)
 * - Toast notifications for failures
 */
export function useOptimisticCart() {
  const { items, itemOperations, dispatch, updateQuantity, removeItem } = useCart();
  
  // Track pending debounced updates
  const pendingUpdates = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
  /**
   * Get the current operation state for a specific item
   */
  const getItemState = useCallback(
    (productId: string, variantId: string): CartItemOperationState => {
      const key = getItemOperationKey(productId, variantId);
      return itemOperations[key] ?? { isUpdating: false, error: null };
    },
    [itemOperations]
  );

  /**
   * Clear error state for a specific item
   */
  const clearItemError = useCallback(
    (productId: string, variantId: string) => {
      const key = getItemOperationKey(productId, variantId);
      dispatch({ type: "SET_ITEM_ERROR", payload: { key, error: null } });
    },
    [dispatch]
  );

  /**
   * Optimistically update quantity with debouncing and rollback support
   */
  const optimisticUpdateQuantity = useCallback(
    async (productId: string, variantId: string, newQuantity: number) => {
      const key = getItemOperationKey(productId, variantId);
      
      // Find current item and store previous quantity for potential rollback
      const currentItem = items.find(
        item => item.productId === productId && item.variantId === variantId
      );
      const previousQuantity = currentItem?.quantity ?? 0;

      // Cancel any pending debounced update for this item
      const pendingTimeout = pendingUpdates.current.get(key);
      if (pendingTimeout) {
        clearTimeout(pendingTimeout);
        pendingUpdates.current.delete(key);
      }

      // 1. Immediately update UI (optimistic)
      if (newQuantity <= 0) {
        dispatch({ type: "REMOVE_ITEM", payload: { productId, variantId } });
      } else {
        dispatch({ type: "UPDATE_QUANTITY", payload: { productId, variantId, quantity: newQuantity } });
      }
      
      // 2. Set loading state
      dispatch({ type: "SET_ITEM_LOADING", payload: { key, isUpdating: true } });

      // 3. Debounce the actual backend call (300ms)
      const timeoutId = setTimeout(async () => {
        pendingUpdates.current.delete(key);
        
        try {
          if (newQuantity <= 0) {
            await removeItem(productId, variantId);
          } else {
            await updateQuantity(productId, variantId, newQuantity);
          }
          
          // Success - clear loading state
          dispatch({ type: "SET_ITEM_LOADING", payload: { key, isUpdating: false } });
        } catch (error) {
          // 4. Rollback on failure
          dispatch({ 
            type: "ROLLBACK_QUANTITY", 
            payload: { productId, variantId, previousQuantity } 
          });
          dispatch({ 
            type: "SET_ITEM_ERROR", 
            payload: { 
              key, 
              error: error instanceof Error ? error.message : "Failed to update cart",
              previousQuantity
            } 
          });
          toast.error("Failed to update cart. Please try again.");
        }
      }, 300);

      pendingUpdates.current.set(key, timeoutId);
    },
    [items, dispatch, updateQuantity, removeItem]
  );

  /**
   * Optimistically remove an item
   */
  const optimisticRemoveItem = useCallback(
    async (productId: string, variantId: string) => {
      const key = getItemOperationKey(productId, variantId);
      
      // Store current item for potential rollback
      const currentItem = items.find(
        item => item.productId === productId && item.variantId === variantId
      );
      
      if (!currentItem) return;

      // 1. Immediately remove from UI
      dispatch({ type: "REMOVE_ITEM", payload: { productId, variantId } });
      dispatch({ type: "SET_ITEM_LOADING", payload: { key, isUpdating: true } });

      try {
        // 2. Call actual backend operation
        await removeItem(productId, variantId);
        dispatch({ type: "SET_ITEM_LOADING", payload: { key, isUpdating: false } });
      } catch (error) {
        // 3. Rollback - re-add the item
        dispatch({ 
          type: "ADD_ITEM", 
          payload: { 
            product: currentItem.product, 
            variant: currentItem.variant, 
            quantity: currentItem.quantity 
          } 
        });
        dispatch({ 
          type: "SET_ITEM_ERROR", 
          payload: { 
            key, 
            error: error instanceof Error ? error.message : "Failed to remove item" 
          } 
        });
        toast.error("Failed to remove item. Please try again.");
      }
    },
    [items, dispatch, removeItem]
  );

  /**
   * Check if any items are currently being updated
   */
  const hasActiveOperations = useCallback((): boolean => {
    return Object.values(itemOperations).some(op => op.isUpdating);
  }, [itemOperations]);

  return {
    optimisticUpdateQuantity,
    optimisticRemoveItem,
    getItemState,
    clearItemError,
    hasActiveOperations,
  };
}
