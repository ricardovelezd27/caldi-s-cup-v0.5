import React, { createContext, useContext, useReducer, useEffect, useMemo, useState } from "react";
import { localCartService } from "@/services/cart/localCartService";
import { useToast } from "@/hooks/use-toast";
import { cartReducer } from "./cartReducer";
import { useCartOperations } from "./cartOperations";
import { initialState, type CartContextValue } from "./cartTypes";
import { getStorage, type StorageType } from "@/utils/storage/storageFactory";

// ============= Context =============

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ============= Provider =============

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [storageType, setStorageType] = useState<StorageType>('localStorage');
  const { toast } = useToast();

  // Get memoized operations
  const operations = useCartOperations({ state, dispatch, toast });

  // Initialize storage and hydrate on mount
  useEffect(() => {
    const storage = getStorage();
    setStorageType(storage.type);
    
    // Warn user if storage is degraded
    if (storage.type === 'memory') {
      toast({
        title: "Limited storage mode",
        description: "Cart items won't persist after closing the browser.",
        duration: 5000,
      });
    } else if (storage.type === 'sessionStorage') {
      toast({
        title: "Session storage mode",
        description: "Cart items will be cleared when you close this tab.",
        duration: 5000,
      });
    }

    const stored = localCartService.loadFromStorage();
    dispatch({ type: "HYDRATE", payload: stored });
  }, [toast]);

  // Persist to storage on state change
  useEffect(() => {
    const storage = getStorage();
    const cartKey = "caldis-cup-cart";
    
    if (state.items.length > 0 || storage.getItem(cartKey)) {
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
      dispatch,
      storageType,
    }),
    [state, operations, dispatch, storageType]
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
