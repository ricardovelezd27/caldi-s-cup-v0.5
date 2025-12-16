import type { ExtendedCartState } from "@/types/cart";
import type { CartAction } from "./cartTypes";
import { localCartService } from "@/services/cart/localCartService";

/**
 * Pure reducer function for cart state management
 * Isolated for testability and SRP compliance
 */
export function cartReducer(state: ExtendedCartState, action: CartAction): ExtendedCartState {
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
      const { subtotal, itemCount } = localCartService.calculateTotals(action.payload);
      return { ...state, items: action.payload, subtotal, itemCount };
    }

    case "ADD_ITEM": {
      const { product, variant, quantity } = action.payload;
      const newItems = localCartService.addItem(state.items, product, variant, quantity);
      const { subtotal, itemCount } = localCartService.calculateTotals(newItems);
      return { ...state, items: newItems, subtotal, itemCount };
    }

    case "UPDATE_QUANTITY": {
      const { productId, variantId, quantity } = action.payload;
      const newItems = localCartService.updateQuantity(state.items, productId, variantId, quantity);
      const { subtotal, itemCount } = localCartService.calculateTotals(newItems);
      return { ...state, items: newItems, subtotal, itemCount };
    }

    case "REMOVE_ITEM": {
      const { productId, variantId } = action.payload;
      const newItems = localCartService.removeItem(state.items, productId, variantId);
      const { subtotal, itemCount } = localCartService.calculateTotals(newItems);
      return { ...state, items: newItems, subtotal, itemCount };
    }

    case "CLEAR_CART":
      return { ...state, items: [], subtotal: 0, itemCount: 0, itemOperations: {} };

    // ============= Optimistic Update Actions =============

    case "SET_ITEM_LOADING": {
      const { key, isUpdating } = action.payload;
      return {
        ...state,
        itemOperations: {
          ...state.itemOperations,
          [key]: {
            ...state.itemOperations[key],
            isUpdating,
            error: isUpdating ? null : state.itemOperations[key]?.error ?? null,
          },
        },
      };
    }

    case "SET_ITEM_ERROR": {
      const { key, error, previousQuantity } = action.payload;
      return {
        ...state,
        itemOperations: {
          ...state.itemOperations,
          [key]: {
            isUpdating: false,
            error,
            previousQuantity,
          },
        },
      };
    }

    case "ROLLBACK_QUANTITY": {
      const { productId, variantId, previousQuantity } = action.payload;
      const newItems = localCartService.updateQuantity(state.items, productId, variantId, previousQuantity);
      const { subtotal, itemCount } = localCartService.calculateTotals(newItems);
      return { ...state, items: newItems, subtotal, itemCount };
    }

    // ============= External Cart Sync Actions =============

    case "SET_EXTERNAL_CART": {
      const { externalCartId, checkoutUrl } = action.payload;
      return {
        ...state,
        externalCartId,
        checkoutUrl: checkoutUrl ?? state.checkoutUrl,
        isBackendConnected: true,
      };
    }

    case "SET_BACKEND_CONNECTED":
      return { ...state, isBackendConnected: action.payload };

    default:
      return state;
  }
}
