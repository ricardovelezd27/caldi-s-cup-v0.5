import type { CartItem, Product, ProductVariant } from "@/types/coffee";
import type { ShopifyCartState, CartOperations } from "@/types/cart";

// ============= Action Types =============

export type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: { product: Product; variant: ProductVariant; quantity: number } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; variantId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: string; variantId: string } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: { items: CartItem[]; subtotal: number; itemCount: number } };

// ============= Initial State =============

export const initialState: ShopifyCartState = {
  items: [],
  subtotal: 0,
  itemCount: 0,
  shopifyCartId: null,
  checkoutUrl: null,
  isShopifyConnected: false,
  isLoading: false,
};

// ============= Context Value Type =============

export interface CartContextValue extends ShopifyCartState, CartOperations {}
