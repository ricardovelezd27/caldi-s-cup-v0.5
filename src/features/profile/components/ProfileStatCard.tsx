import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProfileStatCardProps {
  icon: ReactNode;
  iconClassName?: string;
  metric: ReactNode;
  label: string;
  className?: string;
  compact?: boolean;
  onClick?: () => void;
}

export function ProfileStatCard({ icon, iconClassName, metric, label, className, compact, onClick }: ProfileStatCardProps) {
  const Comp = onClick ? "button" : "div";

  if (compact) {
    return (
      <Comp
        onClick={onClick}
        className={cn(
          "flex flex-row items-center gap-2 rounded-full border-[2px] border-border bg-card px-3 py-2 whitespace-nowrap shrink-0",
          onClick && "cursor-pointer hover:bg-muted/50 transition-colors",
          className,
        )}
        style={{ boxShadow: "2px 2px 0px 0px hsl(var(--border))" }}
      >
        <div className={cn("h-7 w-7 rounded-full flex items-center justify-center shrink-0", iconClassName)}>
          {icon}
        </div>
        <span className="text-base font-bold font-bangers tracking-wide text-foreground">{metric}</span>
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </Comp>
    );
  }

  return (
    <Comp
      onClick={onClick}
      className={cn(
        "rounded-md border-[4px] border-border bg-card p-6 flex flex-col items-center justify-center text-center",
        onClick && "cursor-pointer hover:bg-muted/50 transition-colors",
        className,
      )}
      style={{ boxShadow: "4px 4px 0px 0px hsl(var(--border))" }}
    >
      <div className={cn("h-10 w-10 rounded-full flex items-center justify-center mb-3", iconClassName)}>
        {icon}
      </div>
      <div className="text-2xl font-bold font-bangers tracking-wide text-foreground">{metric}</div>
      <div className="text-sm text-muted-foreground font-medium mt-1">{label}</div>
    </Comp>
  );
}
