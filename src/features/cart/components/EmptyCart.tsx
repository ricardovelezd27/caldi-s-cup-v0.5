import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/app";

export const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <ShoppingCart className="w-12 h-12 text-muted-foreground" />
      </div>
      <h2 className="font-['Bangers'] text-3xl text-foreground tracking-wide mb-2">
        Your Cart is Empty
      </h2>
      <p className="text-muted-foreground max-w-md mb-6">
        Looks like you haven't added any coffee to your cart yet. 
        Explore our marketplace to find your perfect brew!
      </p>
      <Button asChild size="lg">
        <Link to={ROUTES.marketplace}>
          Browse Marketplace
        </Link>
      </Button>
    </div>
  );
};
