import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

interface CartQuantityControlProps {
  productId: string;
  variantId: string;
  quantity: number;
  compact?: boolean;
}

/**
 * Compact quantity control component for cart operations
 * Used in ProductCard and other places where inline quantity adjustment is needed
 */
export const CartQuantityControl = ({
  productId,
  variantId,
  quantity,
  compact = false,
}: CartQuantityControlProps) => {
  const { updateQuantity, removeItem } = useCart();

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity <= 1) {
      removeItem(productId, variantId);
    } else {
      updateQuantity(productId, variantId, quantity - 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(productId, variantId, quantity + 1);
  };

  const iconSize = compact ? "w-3 h-3" : "w-4 h-4";
  const buttonSize = compact ? "h-7 w-7" : "h-8 w-8";

  return (
    <div className="flex items-center gap-1 border-2 border-border rounded-lg bg-background">
      <button
        onClick={handleDecrement}
        className={`${buttonSize} flex items-center justify-center hover:bg-muted rounded-l-md transition-colors active:scale-95`}
        aria-label={quantity <= 1 ? "Remove from cart" : "Decrease quantity"}
      >
        {quantity <= 1 ? (
          <Trash2 className={`${iconSize} text-destructive`} />
        ) : (
          <Minus className={iconSize} />
        )}
      </button>
      
      <span className={`${compact ? "w-6 text-sm" : "w-8"} text-center font-medium`}>
        {quantity}
      </span>
      
      <button
        onClick={handleIncrement}
        className={`${buttonSize} flex items-center justify-center hover:bg-muted rounded-r-md transition-colors active:scale-95`}
        aria-label="Increase quantity"
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
};
