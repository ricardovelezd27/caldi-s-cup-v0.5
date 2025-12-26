import { ReactNode } from 'react';

interface OnboardingSlideProps {
  icon: ReactNode;
  headline: string;
  body: string;
  children?: ReactNode;
}

export const OnboardingSlide = ({ icon, headline, body, children }: OnboardingSlideProps) => {
  return (
    <div className="flex flex-col items-center text-center px-6 sm:px-8 py-8 sm:py-10 w-full">
      {/* Icon */}
      <div className="mb-6 text-primary">
        {icon}
      </div>

      {/* Headline - Uses Bangers font from global styles */}
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
        {headline}
      </h2>

      {/* Body text */}
      <p className="text-lg text-muted-foreground max-w-sm leading-relaxed">
        {body}
      </p>

      {/* Optional custom content */}
      {children && (
        <div className="mt-6">
          {children}
        </div>
      )}
    </div>
  );
};
