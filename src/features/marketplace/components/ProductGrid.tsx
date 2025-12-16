import { Product } from "@/types/coffee";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { Coffee } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  totalCount: number;
}

/**
 * Responsive product grid with loading and empty states
 */
export function ProductGrid({
  products,
  isLoading = false,
  totalCount,
}: ProductGridProps) {
  // Show skeletons while loading
  if (isLoading) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Loading coffees...</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Coffee className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-heading text-xl mb-2">No coffees found</h3>
        <p className="text-muted-foreground max-w-md">
          Try adjusting your filters or search terms to find the perfect coffee
          for you.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {products.length} of {totalCount} coffee
        {totalCount !== 1 ? "s" : ""}
      </p>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
