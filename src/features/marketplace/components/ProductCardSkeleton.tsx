import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for ProductCard - matches layout for smooth loading transitions
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full border-4 border-border rounded-lg bg-card overflow-hidden shadow-[4px_4px_0px_0px_hsl(var(--border))]">
      {/* Image Skeleton */}
      <div className="relative aspect-square bg-muted">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Badge Skeleton */}
        <Skeleton className="h-5 w-20" />

        {/* Title Skeleton */}
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />

        {/* Origin Skeleton */}
        <Skeleton className="h-4 w-2/3" />

        {/* Rating Skeleton */}
        <Skeleton className="h-4 w-24" />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price & Action Skeleton */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t-2 border-border">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}
