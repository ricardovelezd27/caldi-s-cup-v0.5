import { useState, useEffect, useCallback } from 'react';
import { Coffee, Sparkles, Plane, Utensils, Smartphone, LayoutGrid, Rocket, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { OnboardingSlide } from './OnboardingSlide';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const STORAGE_KEY = 'caldis-onboarding-seen';
const TOTAL_SLIDES = 5;

interface OnboardingModalProps {
  onComplete: () => void;
}

export const OnboardingModal = ({ onComplete }: OnboardingModalProps) => {
  const [open, setOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  // Check localStorage on mount
  useEffect(() => {
    const hasSeen = localStorage.getItem(STORAGE_KEY);
    if (!hasSeen) {
      setOpen(true);
    } else {
      onComplete();
    }
  }, [onComplete]);

  // Sync carousel state
  useEffect(() => {
    if (!api) return;

    setCurrentSlide(api.selectedScrollSnap());
    api.on('select', () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  const handleNext = useCallback(() => {
    if (currentSlide < TOTAL_SLIDES - 1) {
      api?.scrollNext();
    } else {
      handleComplete();
    }
  }, [api, currentSlide]);

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setOpen(false);
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const isLastSlide = currentSlide === TOTAL_SLIDES - 1;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleSkip()}>
      <DialogContent 
        className="w-[calc(100vw-2rem)] max-w-md border-4 border-border bg-background p-0 overflow-hidden [&>button]:hidden"
        style={{ boxShadow: '4px 4px 0px 0px hsl(var(--border))' }}
      >
        <VisuallyHidden>
          <DialogTitle>Welcome to Caldi</DialogTitle>
        </VisuallyHidden>
        
        {/* Skip button in corner */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground z-10"
        >
          Skip
        </Button>

        {/* Carousel */}
        <Carousel 
          setApi={setApi} 
          opts={{ loop: false }}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {/* Slide 1: Welcome */}
            <CarouselItem className="pl-0">
              <OnboardingSlide
                icon={
                  <div className="relative">
                    <Coffee className="w-16 h-16" />
                    <Sparkles className="w-6 h-6 absolute -top-1 -right-1 text-accent" />
                  </div>
                }
                headline="Hey there, coffee lover!"
                body="Caldi isn't a quiz about coffee jargon—it's about you."
              />
            </CarouselItem>

            {/* Slide 2: The Secret */}
            <CarouselItem className="pl-0">
              <OnboardingSlide
                icon={
                  <div className="flex gap-3">
                    <Plane className="w-10 h-10" />
                    <Utensils className="w-10 h-10" />
                    <Smartphone className="w-10 h-10" />
                  </div>
                }
                headline="Your Lifestyle = Your Coffee"
                body="We believe how you travel, dine, and organize your day reveals your perfect cup."
              />
            </CarouselItem>

            {/* Slide 3: What You'll Do */}
            <CarouselItem className="pl-0">
              <OnboardingSlide
                icon={<LayoutGrid className="w-16 h-16" />}
                headline="5 Quick Vibes"
                body="Pick the images that match your vibe. No right answers, just your answers."
              >
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-12 h-12 rounded-lg border-2 border-border bg-muted/50 flex items-center justify-center"
                    >
                      <span className="text-muted-foreground text-xs">?</span>
                    </div>
                  ))}
                </div>
              </OnboardingSlide>
            </CarouselItem>

            {/* Slide 4: Meet Your Tribe */}
            <CarouselItem className="pl-0">
              <OnboardingSlide
                icon={
                  <div className="grid grid-cols-2 gap-3 text-4xl">
                    <span>🦊</span>
                    <span>🦉</span>
                    <span>🐦</span>
                    <span>🐝</span>
                  </div>
                }
                headline="Meet Your Coffee Tribe"
                body="Discover which of our 4 coffee personalities matches you."
              />
            </CarouselItem>

            {/* Slide 5: The Payoff */}
            <CarouselItem className="pl-0">
              <OnboardingSlide
                icon={
                  <div className="relative">
                    <Rocket className="w-16 h-16" />
                    <Sparkles className="w-6 h-6 absolute -top-1 -right-2 text-accent" />
                  </div>
                }
                headline="Coffee for YOU"
                body="Personalized recommendations. Zero jargon. Your own coffee journey—starting now."
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        {/* Footer with progress dots and CTA */}
        <div className="px-6 pb-6 pt-2">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: TOTAL_SLIDES }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
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
