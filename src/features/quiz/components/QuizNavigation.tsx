import { Button } from '@/components/ui/button';
import { ChevronRight, SkipForward } from 'lucide-react';
import { useLanguage } from '@/contexts/language';

interface QuizNavigationProps {
  canProceed: boolean;
  canSkip: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onSkip: () => void;
}

export const QuizNavigation = ({ canProceed, canSkip, isLastStep, onNext, onSkip }: QuizNavigationProps) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between gap-4 w-full max-w-md mx-auto mt-8">
      <Button variant="ghost" onClick={onSkip} disabled={!canSkip} className="text-muted-foreground">
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
