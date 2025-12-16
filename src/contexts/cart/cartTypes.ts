import type { CartItem, Product, ProductVariant } from "@/types/coffee";
import type { ExtendedCartState, CartOperations } from "@/types/cart";
import type { StorageType } from "@/utils/storage/storageFactory";

// ============= Action Types =============

export type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: { product: Product; variant: ProductVariant; quantity: number } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; variantId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: string; variantId: string } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: { items: CartItem[]; subtotal: number; itemCount: number } }
  // Optimistic update actions
  | { type: "SET_ITEM_LOADING"; payload: { key: string; isUpdating: boolean } }
  | { type: "SET_ITEM_ERROR"; payload: { key: string; error: string | null; previousQuantity?: number } }
  | { type: "ROLLBACK_QUANTITY"; payload: { productId: string; variantId: string; previousQuantity: number } }
  // External cart sync actions
  | { type: "SET_EXTERNAL_CART"; payload: { externalCartId: string; checkoutUrl?: string } }
  | { type: "SET_BACKEND_CONNECTED"; payload: boolean };

// ============= Initial State =============

export const initialState: ExtendedCartState = {
  items: [],
  subtotal: 0,
  itemCount: 0,
  externalCartId: null,
  checkoutUrl: null,
  isBackendConnected: false,
  isLoading: false,
  itemOperations: {},
};

// ============= Context Value Type =============

export interface CartContextValue extends ExtendedCartState, CartOperations {
  /** Dispatch function for advanced use cases */
  dispatch: React.Dispatch<CartAction>;
  /** Current storage type being used */
  storageType?: StorageType;
}
