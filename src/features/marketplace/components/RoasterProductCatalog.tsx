import { Link } from "react-router-dom";
import type { Product } from "@/types/coffee";
import { ProductCard } from "./ProductCard";

interface RoasterProductCatalogProps {
  products: Product[];
  roasterName: string;
}

export const RoasterProductCatalog = ({ products, roasterName }: RoasterProductCatalogProps) => {
  if (products.length === 0) {
    return (
      <div className="border-4 border-border rounded-lg p-6 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card text-center">
        <p className="text-muted-foreground">
          No products available from {roasterName} yet.
        </p>
        <Link
          to="/marketplace"
          className="text-secondary hover:underline mt-2 inline-block"
        >
          Browse all products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-bangers text-2xl text-foreground tracking-wide mb-4">
        All Products ({products.length})
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
