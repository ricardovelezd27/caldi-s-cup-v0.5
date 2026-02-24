import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useLanguage } from '@/contexts/language';
import { Sparkles } from 'lucide-react';
import tribeIllustration from '@/assets/characters/illustration-coffee-tribe-onboarding.png';

const QUIZ_RESULT_KEY = 'caldi_quiz_result';

interface OnboardingModalProps {
  onComplete: () => void;
  forceShow?: boolean;
  onClose?: () => void;
  isOnboarded?: boolean;
}

export const OnboardingModal = ({ onComplete, forceShow = false, onClose, isOnboarded = false }: OnboardingModalProps) => {
  const [open, setOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  const slides = [
    { headline: t('quiz.onboarding1Headline'), body: t('quiz.onboarding1Body') },
    { headline: t('quiz.onboarding2Headline'), body: t('quiz.onboarding2Body') },
    { headline: t('quiz.onboarding3Headline'), body: t('quiz.onboarding3Body') },
  ];

  const totalSlides = slides.length;
  const isLastSlide = currentSlide === totalSlides - 1;

  useEffect(() => {
    if (forceShow) { setCurrentSlide(0); setOpen(true); return; }
    if (isOnboarded) { onComplete(); return; }
    const hasCompletedQuiz = localStorage.getItem(QUIZ_RESULT_KEY);
    if (!hasCompletedQuiz) { setOpen(true); } else { onComplete(); }
  }, [forceShow, onComplete, isOnboarded]);

  const handleNext = () => { if (isLastSlide) { handleComplete(); } else { setCurrentSlide(prev => prev + 1); } };
  const handleComplete = () => { setOpen(false); setCurrentSlide(0); onComplete(); onClose?.(); };
  const handleSkip = () => { handleComplete(); };

  const currentSlideData = slides[currentSlide];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleSkip()}>
      <DialogContent
        className="w-[calc(100vw-2rem)] max-w-md border-4 border-border rounded-2xl bg-background p-0 overflow-hidden [&>button]:hidden"
        style={{ boxShadow: '4px 4px 0px 0px hsl(var(--border))' }}
      >
        <VisuallyHidden><DialogTitle>Welcome to Caldi</DialogTitle></VisuallyHidden>

        {/* Skip button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground z-10 text-xs"
        >
          {t('quiz.skip')}
        </Button>

        {/* Static illustration with gradient background */}
        <div className="relative w-full flex items-center justify-center pt-8 pb-2"
          style={{
            background: 'linear-gradient(180deg, hsl(var(--primary) / 0.15) 0%, hsl(var(--background)) 100%)',
          }}
        >
          <img
            src={tribeIllustration}
            alt="Coffee tribe characters"
            className="w-48 h-48 object-contain drop-shadow-md"
          />
        </div>

        {/* Text carousel area */}
        <div className="px-6 pb-2 pt-2 min-h-[140px] flex flex-col items-center text-center justify-center">
          <h2
            key={`headline-${currentSlide}`}
            className="text-2xl sm:text-3xl font-bold mb-3 text-foreground animate-in fade-in slide-in-from-right-4 duration-300"
          >
            {currentSlideData.headline}
          </h2>
          <p
            key={`body-${currentSlide}`}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-sm animate-in fade-in slide-in-from-right-4 duration-300 delay-75"
          >
            {currentSlideData.body}
          </p>
        </div>

        {/* Dots + CTA */}
        <div className="px-6 pb-6 pt-2">
          <div className="flex justify-center gap-2 mb-5">
            {slides.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 rounded-full transition-all duration-200",
                  index === currentSlide ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
          <Button onClick={handleNext} className="w-full text-lg font-bold" size="lg">
            {isLastSlide ? (
              <>{t('quiz.letsGo')} <Sparkles className="ml-2 w-5 h-5" /></>
            ) : (
              t('quiz.next')
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
