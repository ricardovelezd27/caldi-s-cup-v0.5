import { useCart } from "@/contexts/cart";

export const CartPreview = () => {
  const { items } = useCart();

  if (items.length === 0) {
    return null;
  }

  // Show up to 4 items in preview
  const previewItems = items.slice(0, 4);
  const remainingCount = items.length - previewItems.length;

  return (
    <div className="border-4 border-border rounded-lg shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card p-4">
      <h3 className="font-['Bangers'] text-lg text-foreground tracking-wide mb-3">
        In Your Cart
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {previewItems.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="relative">
            <img
              src={item.product.images[0] || "/placeholder.svg"}
              alt={item.product.name}
              className="w-full aspect-square object-cover rounded-md border-2 border-border"
            />
            {item.quantity > 1 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            )}
          </div>
        ))}
      </div>
      {remainingCount > 0 && (
        <p className="text-sm text-muted-foreground mt-2 text-center">
          +{remainingCount} more item{remainingCount > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};
