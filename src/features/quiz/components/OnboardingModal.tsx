import { useState, useEffect } from 'react';
import { Coffee, Sparkles, Plane, Utensils, Smartphone, LayoutGrid, Rocket } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const QUIZ_RESULT_KEY = 'caldi_quiz_result';

interface OnboardingModalProps {
  onComplete: () => void;
  forceShow?: boolean;
  onClose?: () => void;
}

// Slide data - easier to maintain
const slides = [
  {
    icon: 'welcome',
    headline: "Hey there, coffee lover!",
    body: "Caldi isn't a quiz about coffee jargon—it's about you."
  },
  {
    icon: 'lifestyle',
    headline: "Your Lifestyle = Your Coffee",
    body: "We believe how you travel, dine, and organize your day reveals your perfect cup."
  },
  {
    icon: 'vibes',
    headline: "5 Quick Vibes",
    body: "Pick the images that match your vibe. No right answers, just your answers."
  },
  {
    icon: 'tribes',
    headline: "Meet Your Coffee Tribe",
    body: "Discover which of our 4 coffee personalities matches you."
  },
  {
    icon: 'payoff',
    headline: "Coffee for YOU",
    body: "Personalized recommendations. Zero jargon. Your own coffee journey—starting now."
  }
];

// Icon components for each slide
const SlideIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'welcome':
      return (
        <div className="relative">
          <Coffee className="w-16 h-16" />
          <Sparkles className="w-6 h-6 absolute -top-1 -right-1 text-accent" />
        </div>
      );
    case 'lifestyle':
      return (
        <div className="flex gap-3">
          <Plane className="w-10 h-10" />
          <Utensils className="w-10 h-10" />
          <Smartphone className="w-10 h-10" />
        </div>
      );
    case 'vibes':
      return <LayoutGrid className="w-16 h-16" />;
    case 'tribes':
      return (
        <div className="grid grid-cols-2 gap-3 text-4xl">
          <span>🦊</span>
          <span>🦉</span>
          <span>🐦</span>
          <span>🐝</span>
        </div>
      );
    case 'payoff':
      return (
        <div className="relative">
          <Rocket className="w-16 h-16" />
          <Sparkles className="w-6 h-6 absolute -top-1 -right-2 text-accent" />
        </div>
      );
    default:
      return <Coffee className="w-16 h-16" />;
  }
};

export const OnboardingModal = ({ onComplete, forceShow = false, onClose }: OnboardingModalProps) => {
  const [open, setOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = slides.length;
  const isLastSlide = currentSlide === totalSlides - 1;

  // Check if quiz has been completed
  useEffect(() => {
    if (forceShow) {
      setCurrentSlide(0);
      setOpen(true);
      return;
    }
    
    const hasCompletedQuiz = localStorage.getItem(QUIZ_RESULT_KEY);
    if (!hasCompletedQuiz) {
      setOpen(true);
    } else {
      onComplete();
    }
  }, [forceShow, onComplete]);

  const handleNext = () => {
    if (isLastSlide) {
      handleComplete();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleComplete = () => {
    setOpen(false);
    setCurrentSlide(0);
    onComplete();
    onClose?.();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const currentSlideData = slides[currentSlide];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleSkip()}>
      <DialogContent 
        className="w-[calc(100vw-2rem)] max-w-md border-4 border-border bg-background p-0 [&>button]:hidden"
        style={{ boxShadow: '4px 4px 0px 0px hsl(var(--border))' }}
      >
        <VisuallyHidden>
          <DialogTitle>Welcome to Caldi</DialogTitle>
        </VisuallyHidden>
        
        {/* Skip button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground z-10"
        >
          Skip
        </Button>

        {/* Slide Content - Simple div, no carousel */}
        <div className="px-6 pt-12 pb-4">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="mb-6 text-primary">
              <SlideIcon type={currentSlideData.icon} />
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
              {currentSlideData.headline}
            </h2>

            {/* Body */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {currentSlideData.body}
            </p>

            {/* Extra content for vibes slide */}
            {currentSlideData.icon === 'vibes' && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="w-12 h-12 rounded-lg border-2 border-border bg-muted/50 flex items-center justify-center"
                  >
                    <span className="text-muted-foreground text-xs">?</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer with progress dots and CTA */}
        <div className="px-6 pb-6 pt-4">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {slides.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 rounded-full transition-all duration-200",
                  index === currentSlide
                    ? "w-6 bg-primary"
                    : "w-2 bg-muted-foreground/30"
                )}
              />
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleNext}
            className="w-full text-lg font-bold"
            size="lg"
          >
            {isLastSlide ? (
              <>
                Let's Go! <Sparkles className="ml-2 w-5 h-5" />
              </>
            ) : (
              'Next'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
