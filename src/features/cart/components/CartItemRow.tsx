import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/types/coffee";
import { useCart } from "@/contexts/cart";
import { formatPrice } from "@/utils/formatters";

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow = ({ item }: CartItemRowProps) => {
  const { updateQuantity, removeItem } = useCart();
  const { product, variant, quantity } = item;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity <= 0) {
      removeItem(product.id, variant.id);
    } else {
      updateQuantity(product.id, variant.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeItem(product.id, variant.id);
  };

  const lineTotal = variant.price * quantity;

  return (
    <div className="flex gap-4 p-4 border-4 border-border rounded-lg shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card">
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="shrink-0">
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border-2 border-border"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/product/${product.id}`}
          className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
        >
          {product.name}
        </Link>
        <p className="text-sm text-muted-foreground mt-1">{variant.name}</p>
        <p className="text-sm font-medium text-foreground mt-1">
          {formatPrice(variant.price)} each
        </p>

        {/* Mobile: Quantity & Remove */}
        <div className="flex items-center justify-between mt-3 md:hidden">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(-1)}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(1)}
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleRemove}
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Desktop: Quantity Controls */}
      <div className="hidden md:flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(-1)}
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(1)}
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Desktop: Line Total & Remove */}
      <div className="hidden md:flex flex-col items-end justify-between min-w-[100px]">
        <span className="font-bold text-lg text-foreground">{formatPrice(lineTotal)}</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleRemove}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Remove
        </Button>
      </div>
    </div>
  );
};
