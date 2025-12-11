import { cn } from "@/lib/utils";
import React from "react";

interface CaldiCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'highlight' | 'glass';
  className?: string;
  style?: React.CSSProperties;
}

export const CaldiCard = ({
  children,
  variant = 'default',
  className,
  style,
}: CaldiCardProps) => {
  return (
    <div 
      className={cn(
        "caldi-card p-6",
        variant === 'highlight' && "bg-primary/10 border-primary",
        variant === 'glass' && "caldi-card-glass",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};
