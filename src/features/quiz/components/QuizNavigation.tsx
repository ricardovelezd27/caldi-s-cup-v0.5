import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';
import { useLanguage } from '@/contexts/language';

interface QuizNavigationProps {
  canProceed: boolean;
  canSkip: boolean;
  canGoBack: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export const QuizNavigation = ({ canProceed, canSkip, canGoBack, isLastStep, onNext, onSkip, onBack }: QuizNavigationProps) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between gap-4 w-full max-w-md mx-auto mt-8">
      <Button variant="ghost" onClick={onBack} disabled={!canGoBack} className="text-muted-foreground">
        <ChevronLeft className="w-4 h-4 mr-1" />
        {t('quiz.back')}
      </Button>
      <Button variant="ghost" onClick={onSkip} disabled={!canSkip} className="text-muted-foreground text-sm">
        <SkipForward className="w-4 h-4 mr-1" />
        {t('quiz.skip')}
      </Button>
      <Button onClick={onNext} disabled={!canProceed} className="flex-1 max-w-[200px]">
        {isLastStep ? t('quiz.seeResults') : t('quiz.nextScenario')}
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};
