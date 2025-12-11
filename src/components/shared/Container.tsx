import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
}

export const Container = ({ 
  children, 
  className,
  size = 'default' 
}: ContainerProps) => {
  const sizeClasses = {
    narrow: 'max-w-3xl',
    default: 'max-w-5xl',
    wide: 'max-w-7xl',
  };

  return (
    <div className={cn(
      "container mx-auto px-4",
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
};
