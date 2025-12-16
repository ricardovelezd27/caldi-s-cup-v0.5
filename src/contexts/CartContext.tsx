import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import type { CartItem, Product, ProductVariant } from "@/types/coffee";
import type { ShopifyCartState, CartOperations } from "@/types/cart";
import {
  localCartService,
  loadCartFromStorage,
  saveCartToStorage,
  calculateCartTotals,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  getCartItemByIds,
} from "@/services/cart/localCartService";
import { useToast } from "@/hooks/use-toast";

// ============= State & Actions =============

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: { product: Product; variant: ProductVariant; quantity: number } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; variantId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: string; variantId: string } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: { items: CartItem[]; subtotal: number; itemCount: number } };

const initialState: ShopifyCartState = {
  items: [],
  subtotal: 0,
  itemCount: 0,
  shopifyCartId: null,
  checkoutUrl: null,
  isShopifyConnected: false,
  isLoading: false,
};

function cartReducer(state: ShopifyCartState, action: CartAction): ShopifyCartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "HYDRATE": {
      return {
        ...state,
        items: action.payload.items,
        subtotal: action.payload.subtotal,
        itemCount: action.payload.itemCount,
      };
    }

    case "SET_ITEMS": {
      const { subtotal, itemCount } = calculateCartTotals(action.payload);
      return { ...state, items: action.payload, subtotal, itemCount };
    }

    case "ADD_ITEM": {
      const { product, variant, quantity } = action.payload;
      const newItems = addItemToCart(state.items, product, variant, quantity);
      const { subtotal, itemCount } = calculateCartTotals(newItems);
      return { ...state, items: newItems, subtotal, itemCount };
    }

    case "UPDATE_QUANTITY": {
      const { productId, variantId, quantity } = action.payload;
      const newItems = updateItemQuantity(state.items, productId, variantId, quantity);
      const { subtotal, itemCount } = calculateCartTotals(newItems);
      return { ...state, items: newItems, subtotal, itemCount };
    }

    case "REMOVE_ITEM": {
      const { productId, variantId } = action.payload;
      const newItems = removeItemFromCart(state.items, productId, variantId);
      const { subtotal, itemCount } = calculateCartTotals(newItems);
      return { ...state, items: newItems, subtotal, itemCount };
    }

    case "CLEAR_CART":
      return { ...state, items: [], subtotal: 0, itemCount: 0 };

    default:
      return state;
  }
}

// ============= Context =============

interface CartContextValue extends ShopifyCartState, CartOperations {}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ============= Provider =============

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { toast } = useToast();

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = loadCartFromStorage();
    dispatch({ type: "HYDRATE", payload: stored });
  }, []);

  // Persist to localStorage on state change
  useEffect(() => {
    if (state.items.length > 0 || localStorage.getItem("caldis-cup-cart")) {
      saveCartToStorage({
        items: state.items,
        subtotal: state.subtotal,
        itemCount: state.itemCount,
      });
    }
  }, [state.items, state.subtotal, state.itemCount]);

  // ============= Cart Operations =============

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
    [toast]
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
    []
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
    [toast]
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
  }, [toast]);

  const getCartItem = useCallback(
    (productId: string, variantId: string): CartItem | undefined => {
      return getCartItemByIds(state.items, productId, variantId);
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

  const value: CartContextValue = {
    ...state,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getCartItem,
    proceedToCheckout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// ============= Hook =============

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
