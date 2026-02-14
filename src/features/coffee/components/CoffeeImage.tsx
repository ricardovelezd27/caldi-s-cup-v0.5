import { cn } from "@/lib/utils";

interface CoffeeImageProps {
  src: string | null;
  alt: string;
  className?: string;
  isTemporaryImage?: boolean;
}

export function CoffeeImage({ src, alt, className, isTemporaryImage }: CoffeeImageProps) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-lg border-4 border-border bg-muted shadow-[4px_4px_0px_0px_hsl(var(--border))]",
        className
      )}
    >
      {src ? (
        <>
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {isTemporaryImage && (
            <div className="absolute bottom-0 inset-x-0 bg-foreground/80 px-3 py-2 text-center">
              <p className="text-background text-sm font-medium">
                <a href="/auth" className="underline text-primary font-bold">Sign in</a>
                {" "}to save this image to your collection
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-muted-foreground text-sm">No image</span>
        </div>
      )}
    </div>
  );
}
