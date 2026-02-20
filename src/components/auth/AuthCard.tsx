import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthCard = ({ children, title, subtitle }: AuthCardProps) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border-4 border-border rounded-lg p-8 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bangers font-bold text-foreground mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
