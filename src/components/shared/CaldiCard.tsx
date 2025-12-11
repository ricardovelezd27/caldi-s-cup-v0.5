import { cn } from "@/lib/utils";

interface CaldiCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'highlight';
  className?: string;
}

export const CaldiCard = ({
  children,
  variant = 'default',
  className,
}: CaldiCardProps) => {
  return (
    <div className={cn(
      "caldi-card p-6",
      variant === 'highlight' && "bg-primary/10 border-primary",
      className
    )}>
      {children}
    </div>
  );
};
