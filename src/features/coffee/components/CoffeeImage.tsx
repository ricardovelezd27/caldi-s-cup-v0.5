import { cn } from "@/lib/utils";

interface CoffeeImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function CoffeeImage({ src, alt, className }: CoffeeImageProps) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-lg border-4 border-border bg-muted shadow-[4px_4px_0px_0px_hsl(var(--border))]",
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-muted-foreground text-sm">No image</span>
        </div>
      )}
    </div>
  );
}
