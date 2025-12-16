import { useCallback, useMemo } from "react";
import type { Dispatch } from "react";
import type { CartItem, Product, ProductVariant } from "@/types/coffee";
import type { ShopifyCartState, CartOperations } from "@/types/cart";
import type { CartAction } from "./cartTypes";
import { localCartService } from "@/services/cart/localCartService";

interface UseCartOperationsProps {
  state: ShopifyCartState;
  dispatch: Dispatch<CartAction>;
  toast: (opts: { title: string; description: string }) => void;
}

/**
 * Custom hook that provides memoized cart operations
 * Separated for SRP compliance and easy Shopify swap in Phase 2B
 */
export function useCartOperations({ state, dispatch, toast }: UseCartOperationsProps): CartOperations {
  const addToCart = useCallback(
    async (product: Product, variant: ProductVariant, quantity: number): Promise<void> => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        // In Phase 2B, this will call Shopify Cart API
        dispatch({ type: "ADD_ITEM", payload: { product, variant, quantity } });
        toast({
          title: "Added to cart!",
          description: `${quantity}x ${product.name} (${variant.name})`,
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [dispatch, toast]
  );

  const updateQuantity = useCallback(
    async (productId: string, variantId: string, quantity: number): Promise<void> => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        // In Phase 2B, this will call Shopify Cart API
        dispatch({ type: "UPDATE_QUANTITY", payload: { productId, variantId, quantity } });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [dispatch]
  );

  const removeItem = useCallback(
    async (productId: string, variantId: string): Promise<void> => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        // In Phase 2B, this will call Shopify Cart API
        dispatch({ type: "REMOVE_ITEM", payload: { productId, variantId } });
        toast({
          title: "Item removed",
          description: "Item has been removed from your cart.",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [dispatch, toast]
  );

  const clearCart = useCallback(async (): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // In Phase 2B, this will call Shopify Cart API
      dispatch({ type: "CLEAR_CART" });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [dispatch, toast]);

  const getCartItem = useCallback(
    (productId: string, variantId: string): CartItem | undefined => {
      return localCartService.getItem(state.items, productId, variantId);
    },
    [state.items]
  );

  const proceedToCheckout = useCallback(async (): Promise<string | null> => {
    // In Phase 2B, this will return the Shopify checkout URL
    if (state.isShopifyConnected && state.checkoutUrl) {
      window.location.href = state.checkoutUrl;
      return state.checkoutUrl;
    }

    // Phase 2A: Show informative message
    toast({
      title: "Checkout coming soon!",
      description: "Shopify checkout integration will be available in Phase 2B.",
    });
    return null;
  }, [state.isShopifyConnected, state.checkoutUrl, toast]);

  // Memoize operations object to prevent unnecessary re-renders
  return useMemo<CartOperations>(
    () => ({
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      getCartItem,
      proceedToCheckout,
    }),
    [addToCart, updateQuantity, removeItem, clearCart, getCartItem, proceedToCheckout]
  );
}
