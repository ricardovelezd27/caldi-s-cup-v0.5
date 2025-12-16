import type { ShopifyCartState } from "@/types/cart";
import type { CartAction } from "./cartTypes";
import { localCartService } from "@/services/cart/localCartService";

/**
 * Pure reducer function for cart state management
 * Isolated for testability and SRP compliance
 */
export function cartReducer(state: ShopifyCartState, action: CartAction): ShopifyCartState {
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
      return { ...state, items: [], subtotal: 0, itemCount: 0 };

    default:
      return state;
  }
}
