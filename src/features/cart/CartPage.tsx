import { Link } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { Container } from "@/components/shared";
import { useCart } from "@/contexts/cart";
import { ROUTES } from "@/constants/app";
import {
  CartItemRow,
  OrderSummary,
  CartPreview,
  EmptyCart,
} from "./components";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const CartPage = () => {
  const { items, itemCount, clearCart } = useCart();

  const handleClearCart = () => {
    clearCart();
  };

  return (
    <PageLayout>
      <Container size="wide" className="py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <h1 className="font-['Bangers'] text-4xl md:text-5xl text-foreground tracking-wide">
              Shopping Cart
            </h1>
            <p className="text-muted-foreground mt-1">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <Button variant="outline" asChild className="active:scale-[0.98] transition-transform">
              <Link to={ROUTES.marketplace}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>

            {items.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="text-destructive hover:text-destructive active:scale-[0.98] transition-transform"
                  >
                    <Trash2 className="w-4 h-4 sm:mr-2" />
                    <span className="sm:inline">Clear Cart</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove all {itemCount} items from your cart. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearCart}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98] transition-transform"
                    >
                      Clear Cart
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Empty State */}
        {items.length === 0 && <EmptyCart />}

        {/* Cart Content */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItemRow
                  key={`${item.productId}-${item.variantId}`}
                  item={item}
                />
              ))}
            </div>

            {/* Sidebar: Summary & Preview */}
            <div className="space-y-6">
              <OrderSummary />
              <CartPreview />
            </div>
          </div>
        )}
      </Container>
    </PageLayout>
  );
};
