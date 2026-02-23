import { cn } from "@/lib/utils";

interface StreakDisplayProps {
  currentStreak: number;
  size?: "sm" | "md";
  className?: string;
}

export function StreakDisplay({ currentStreak, size = "md", className }: StreakDisplayProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-border bg-card shadow-[2px_2px_0px_0px_hsl(var(--border))]",
        className,
      )}
    >
      <span className={size === "sm" ? "text-base" : "text-xl"}>🔥</span>
      <span
        className={cn(
          "font-bangers tracking-wide text-foreground",
          size === "sm" ? "text-sm" : "text-lg",
        )}
      >
        {currentStreak}
      </span>
    </div>
  );
}
