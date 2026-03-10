import { cn } from "@/lib/utils";

interface HeartsDisplayProps {
  hearts: number;
  maxHearts: number;
  timeUntilRefill?: number | null; // ms
  onClick?: () => void;
}

function formatCountdown(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function HeartsDisplay({ hearts, maxHearts, timeUntilRefill, onClick }: HeartsDisplayProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 px-2 py-1"
      aria-label={`${hearts} of ${maxHearts} hearts`}
    >
      <div className="flex items-center gap-0.5">
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
      </div>
      {timeUntilRefill != null && hearts < maxHearts && (
        <span className="text-[10px] font-inter text-muted-foreground leading-none">
          {formatCountdown(timeUntilRefill)}
        </span>
      )}
    </button>
  );
}
