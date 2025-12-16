import React, { createContext, useContext, useReducer, useEffect, useMemo } from "react";
import { localCartService } from "@/services/cart/localCartService";
import { useToast } from "@/hooks/use-toast";
import { cartReducer } from "./cartReducer";
import { useCartOperations } from "./cartOperations";
import { initialState, type CartContextValue } from "./cartTypes";

// ============= Context =============

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ============= Provider =============

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { toast } = useToast();

  // Get memoized operations
  const operations = useCartOperations({ state, dispatch, toast });

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localCartService.loadFromStorage();
    dispatch({ type: "HYDRATE", payload: stored });
  }, []);

  // Persist to localStorage on state change
  useEffect(() => {
    if (state.items.length > 0 || localStorage.getItem("caldis-cup-cart")) {
      localCartService.saveToStorage({
        items: state.items,
        subtotal: state.subtotal,
        itemCount: state.itemCount,
      });
    }
  }, [state.items, state.subtotal, state.itemCount]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      ...operations,
    }),
    [state, operations]
  );

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
