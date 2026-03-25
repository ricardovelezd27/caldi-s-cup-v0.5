import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/language';

interface QuizNavigationProps {
  canProceed: boolean;
  canGoBack: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onBack: () => void;
}

export const QuizNavigation = ({ canProceed, canGoBack, isLastStep, onNext, onBack }: QuizNavigationProps) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between gap-4 w-full max-w-md mx-auto mt-8">
      <Button variant="ghost" onClick={onBack} disabled={!canGoBack} className="text-muted-foreground px-3">
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Button onClick={onNext} disabled={!canProceed} className="flex-1 max-w-[200px]">
        {isLastStep ? t('quiz.seeResults') : t('quiz.nextScenario')}
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};
