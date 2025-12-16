import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "@/types/coffee";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { formatRoastLevel } from "../utils/productFilters";
import { CartQuantityControl } from "./CartQuantityControl";

interface ProductCardProps {
  product: Product;
}

/**
 * Product card component for marketplace browse grid
 * Uses React.memo for render optimization in lists
 */
export const ProductCard = memo(function ProductCard({
  product,
}: ProductCardProps) {
  const {
    id,
    name,
    origin,
    roastLevel,
    basePrice,
    imageUrl,
    roasterId,
    roasterName,
    rating,
    reviewCount,
    isOrganic,
    isFairTrade,
    isBestSeller,
    isFeatured,
    variants,
  } = product;

  const { addToCart, getCartItem } = useCart();
  
  // Get the first variant as default for quick add
  const defaultVariant = variants?.[0];
  const cartItem = defaultVariant ? getCartItem(id, defaultVariant.id) : undefined;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (defaultVariant) {
      addToCart(product, defaultVariant, 1);
    }
  };

  return (
    <div className="group flex flex-col h-full border-4 border-border rounded-lg bg-card overflow-hidden shadow-[4px_4px_0px_0px_hsl(var(--border))] transition-transform hover:-translate-y-1">
      {/* Image Container */}
      <Link to={`/product/${id}`} className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {isBestSeller && (
            <Badge className="bg-primary text-primary-foreground border-2 border-border text-xs">
              Best Seller
            </Badge>
          )}
          {isFeatured && !isBestSeller && (
            <Badge className="bg-accent text-accent-foreground border-2 border-border text-xs">
              Featured
            </Badge>
          )}
        </div>
        {/* Certification Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {isOrganic && (
            <Badge variant="secondary" className="text-xs border-2 border-border">
              Organic
            </Badge>
          )}
          {isFairTrade && (
            <Badge variant="secondary" className="text-xs border-2 border-border">
              Fair Trade
            </Badge>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Roast Level Badge */}
        <Badge
          variant="outline"
          className="w-fit text-xs border-2 border-border capitalize"
        >
          {formatRoastLevel(roastLevel)} Roast
        </Badge>

        {/* Product Name */}
        <Link to={`/product/${id}`}>
          <h3 className="font-heading text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        {/* Origin & Roaster */}
        <p className="text-sm text-muted-foreground line-clamp-1">
          {origin} •{" "}
          <Link
            to={`/roaster/${roasterId}`}
            className="hover:text-secondary hover:underline transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {roasterName}
          </Link>
        </p>

        {/* Rating */}
        {rating && reviewCount ? (
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-muted-foreground">
              ({reviewCount.toLocaleString()})
            </span>
          </div>
        ) : null}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t-2 border-border">
          <div>
            <span className="text-sm text-muted-foreground">From </span>
            <span className="font-heading text-xl">${basePrice.toFixed(2)}</span>
          </div>
          
          {cartItem ? (
            <CartQuantityControl
              productId={id}
              variantId={defaultVariant!.id}
              quantity={cartItem.quantity}
              compact
            />
          ) : (
            <Button
              size="sm"
              className="gap-1 active:scale-95 transition-transform"
              onClick={handleAddToCart}
              disabled={!defaultVariant}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="sr-only sm:not-sr-only">Add</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});
