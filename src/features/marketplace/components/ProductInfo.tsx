import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { Product } from "@/types/coffee";

interface ProductInfoProps {
  product: Product;
}

const roastLevelLabels: Record<string, string> = {
  light: "Light Roast",
  medium: "Medium Roast",
  dark: "Dark Roast"
};

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const formattedRating = product.rating?.toFixed(1) || "0.0";
  const formattedReviews = product.reviewCount?.toLocaleString() || "0";

  return (
    <div className="space-y-3">
      {/* Roast Level Badge */}
      <Badge 
        variant="secondary" 
        className="text-xs font-medium uppercase tracking-wide"
      >
        {roastLevelLabels[product.roastLevel] || product.roastLevel}
      </Badge>

      {/* Product Name */}
      <h1 className="font-bangers text-3xl md:text-4xl text-foreground tracking-wide">
        {product.name}
      </h1>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 fill-primary text-primary" />
          <span className="font-semibold text-foreground">{formattedRating}</span>
        </div>
        <span className="text-muted-foreground">•</span>
        <span className="text-muted-foreground text-sm">
          {formattedReviews} reviews
        </span>
      </div>

      {/* Roaster Link */}
      <p className="text-sm text-muted-foreground">
        By{" "}
        <Link 
          to={`/roaster/${product.roasterId}`}
          className="text-secondary hover:text-secondary/80 underline underline-offset-2 transition-colors"
        >
          {product.roasterName}
        </Link>
      </p>
    </div>
  );
};
