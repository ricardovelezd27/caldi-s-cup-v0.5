import { cn } from "@/lib/utils";

interface HeartsDisplayProps {
  hearts: number;
  maxHearts: number;
  onClick?: () => void;
}

export function HeartsDisplay({ hearts, maxHearts, onClick }: HeartsDisplayProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-0.5 px-2 py-1"
      aria-label={`${hearts} of ${maxHearts} hearts`}
    >
      {Array.from({ length: maxHearts }, (_, i) => (
        <span
          key={i}
          className={cn(
            "text-base transition-all",
            i < hearts ? "opacity-100" : "opacity-30 grayscale",
            hearts <= 2 && i < hearts && "animate-pulse",
          )}
        >
          ❤️
        </span>
      ))}
    </button>
  );
}
