import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ScanResultsImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export function ScanResultsImage({ src, alt, className = "" }: ScanResultsImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted border-4 border-border rounded-lg shadow-[4px_4px_0px_0px_hsl(var(--border))] aspect-square ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="text-center text-muted-foreground p-8">
          <ImageOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-4 border-border rounded-lg shadow-[4px_4px_0px_0px_hsl(var(--border))] overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover aspect-square"
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  );
}
