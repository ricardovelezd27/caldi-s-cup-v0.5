import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  color?: 'foreground' | 'primary' | 'secondary';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeading = ({
  title,
  subtitle,
  color = 'foreground',
  align = 'center',
  className,
}: SectionHeadingProps) => {
  const colorClasses = {
    foreground: 'text-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={cn(alignClasses[align], className)}>
      <h2 className={cn(
        "text-4xl md:text-5xl font-bangers mb-4",
        colorClasses[color]
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};
