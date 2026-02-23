import { useXP } from "../../hooks/useXP";
import { cn } from "@/lib/utils";

interface XPCounterProps {
  xp: number;
  className?: string;
}

export function XPCounter({ xp, className }: XPCounterProps) {
  const displayed = useXP(xp);

  return (
    <div className={cn("inline-flex items-center gap-1.5 font-bangers text-2xl text-primary", className)}>
      <span>+{displayed}</span>
      <span className="text-lg">XP</span>
    </div>
  );
}
