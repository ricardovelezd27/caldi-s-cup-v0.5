import type { Product } from "@/types/coffee";

interface ProductDescriptionProps {
  product: Product;
}

/**
 * Mobile-only component that displays description and tasting notes
 * without accordion collapse (always visible on mobile/tablet).
 */
export const ProductDescription = ({ product }: ProductDescriptionProps) => {
  return (
    <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card space-y-3">
      <p className="text-muted-foreground">{product.description}</p>
      
      {product.tastingNotes && (
        <div>
          <h4 className="font-semibold text-foreground mb-1">Tasting Notes</h4>
          <p className="text-muted-foreground">{product.tastingNotes}</p>
        </div>
      )}
    </div>
  );
};
