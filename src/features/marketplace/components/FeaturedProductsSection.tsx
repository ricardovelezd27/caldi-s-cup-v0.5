import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/types/coffee";

interface FeaturedProductsSectionProps {
  products: Product[];
}

export const FeaturedProductsSection = ({ products }: FeaturedProductsSectionProps) => {
  if (products.length === 0) return null;

  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-primary fill-primary" />
        <h2 className="font-bangers text-xl text-foreground tracking-wide">
          Featured Coffees
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {products.slice(0, 3).map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group flex gap-3 p-3 rounded-lg border-2 border-border hover:border-secondary transition-colors"
          >
            {/* Image */}
            <div className="w-16 h-16 rounded-md border-2 border-border bg-muted flex-shrink-0 overflow-hidden">
              <img
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate group-hover:text-secondary transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {product.origin}
              </p>
              <p className="text-sm font-bold text-secondary mt-1">
                ${product.basePrice.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
