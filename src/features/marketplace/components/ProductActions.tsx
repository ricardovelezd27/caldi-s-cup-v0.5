import { useState } from "react";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/contexts/cart";
import type { Product } from "@/types/coffee";

interface ProductActionsProps {
  product: Product;
}

export const ProductActions = ({ product }: ProductActionsProps) => {
  const { addToCart, getCartItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
  const isInStock = selectedVariant?.available && (selectedVariant?.inventoryQuantity || 0) > 0;
  const existingCartItem = selectedVariant 
    ? getCartItem(product.id, selectedVariant.id) 
    : undefined;

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(prev + delta, selectedVariant?.inventoryQuantity || 10)));
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    setIsAdding(true);
    try {
      await addToCart(product, selectedVariant, quantity);
      // Reset quantity after adding
      setQuantity(1);
    } finally {
      // Brief visual feedback
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  if (!selectedVariant) {
    return <div className="text-muted-foreground">No variants available</div>;
  }

  return (
    <div className="border-4 border-border rounded-lg p-5 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card space-y-5">
      {/* Variant Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Size & Grind
        </label>
        <Select value={selectedVariantId} onValueChange={setSelectedVariantId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select variant" />
          </SelectTrigger>
          <SelectContent>
            {product.variants.map(variant => (
              <SelectItem 
                key={variant.id} 
                value={variant.id}
                disabled={!variant.available}
              >
                {variant.name} - {formatPrice(variant.price)}
                {!variant.available && " (Out of stock)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Display */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">
            {formatPrice(selectedVariant.price)}
          </span>
          {selectedVariant.compareAtPrice && (
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(selectedVariant.compareAtPrice)}
            </span>
          )}
        </div>
        
        {/* Stock Status */}
        {isInStock ? (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Check className="w-3 h-3 mr-1" />
            In Stock
          </Badge>
        ) : (
          <Badge variant="outline" className="text-destructive border-destructive">
            Out of Stock
          </Badge>
        )}

        {/* Show if item already in cart */}
        {existingCartItem && (
          <p className="text-sm text-muted-foreground">
            {existingCartItem.quantity} already in cart
          </p>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-12 text-center font-semibold text-lg">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= (selectedVariant?.inventoryQuantity || 10)}
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        className="w-full"
        size="lg"
        onClick={handleAddToCart}
        disabled={!isInStock || isAdding}
      >
        {isAdding ? (
          <>
            <Check className="w-5 h-5 mr-2" />
            Added!
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </>
        )}
      </Button>

      {/* Total Price */}
      <p className="text-center text-sm text-muted-foreground">
        Total: <span className="font-semibold text-foreground">{formatPrice(selectedVariant.price * quantity)}</span>
      </p>
    </div>
  );
};
