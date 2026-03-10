import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProfileStatCardProps {
  icon: ReactNode;
  iconClassName?: string;
  metric: ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
}

export function ProfileStatCard({ icon, iconClassName, metric, label, className, onClick }: ProfileStatCardProps) {
  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      onClick={onClick}
      className={cn(
        "rounded-lg border border-border bg-card p-6 flex flex-col items-center justify-center text-center",
        onClick && "cursor-pointer hover:bg-muted/50 transition-colors",
        className,
      )}
    >
      <div className={cn("h-10 w-10 rounded-full flex items-center justify-center mb-3", iconClassName)}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-foreground">{metric}</div>
      <div className="text-sm text-muted-foreground font-medium mt-1">{label}</div>
    </Comp>
  );
}
