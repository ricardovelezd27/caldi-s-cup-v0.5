import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/cart";
import { formatPrice } from "@/utils/formatters";

export const OrderSummary = () => {
  const { subtotal, itemCount, proceedToCheckout, isLoading, isShopifyConnected } = useCart();

  const handleCheckout = () => {
    proceedToCheckout();
  };

  return (
    <div className="border-4 border-border rounded-lg shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card p-5 space-y-4">
      <h2 className="font-['Bangers'] text-2xl text-foreground tracking-wide">Order Summary</h2>

      <div className="space-y-3">
        <div className="flex justify-between text-foreground">
          <span>Subtotal ({itemCount} items)</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span className="text-sm">Calculated at checkout</span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>Taxes</span>
          <span className="text-sm">Calculated at checkout</span>
        </div>
      </div>

      <Separator className="bg-border" />

      <div className="flex justify-between text-foreground">
        <span className="font-bold text-lg">Estimated Total</span>
        <span className="font-bold text-lg">{formatPrice(subtotal)}</span>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={handleCheckout}
        disabled={itemCount === 0 || isLoading}
      >
        <ShoppingBag className="w-5 h-5 mr-2" />
        {isShopifyConnected ? "Proceed to Checkout" : "Proceed to Checkout"}
      </Button>

      {!isShopifyConnected && (
        <p className="text-xs text-center text-muted-foreground">
          Shopify checkout integration coming in Phase 2B
        </p>
      )}
    </div>
  );
};
