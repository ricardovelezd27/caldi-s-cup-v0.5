import { z } from "zod";
import type { CartItem } from "@/types/coffee";
import type { LocalCartState } from "@/services/cart/localCartService";

/**
 * Cart Validation Schemas
 * 
 * Runtime validation for cart data integrity and security.
 * Prevents localStorage injection, invalid quantities, and malformed data.
 */

// Constants for validation bounds
export const CART_VALIDATION = {
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 99,
  MAX_PRICE: 10000, // Maximum reasonable price per item
  MAX_ITEMS: 50, // Maximum items in cart
} as const;

/**
 * Product Variant Schema (minimal required fields for cart)
 */
const ProductVariantSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  size: z.string().optional(),
  grind: z.string().optional(),
  price: z.number().min(0).max(CART_VALIDATION.MAX_PRICE),
  compareAtPrice: z.number().min(0).max(CART_VALIDATION.MAX_PRICE).optional(),
  inStock: z.boolean().optional(),
}).passthrough();

/**
 * Product Schema (minimal required fields for cart display)
 */
const CartProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
}).passthrough();

/**
 * Cart Item Schema
 */
export const CartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  product: CartProductSchema,
  variant: ProductVariantSchema,
  quantity: z
    .number()
    .int()
    .min(CART_VALIDATION.MIN_QUANTITY)
    .max(CART_VALIDATION.MAX_QUANTITY),
  lineId: z.string().optional(),
}).passthrough();

/**
 * Local Cart State Schema (for localStorage)
 */
export const LocalCartStateSchema = z.object({
  items: z.array(CartItemSchema).max(CART_VALIDATION.MAX_ITEMS),
  subtotal: z.number().min(0),
  itemCount: z.number().int().min(0),
});

// Use the actual types from the codebase for return values
// The schemas are for runtime validation only
export type ValidatedCartItem = CartItem;
export type ValidatedLocalCartState = LocalCartState;
