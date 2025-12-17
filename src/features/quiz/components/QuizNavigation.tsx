import { Button } from '@/components/ui/button';
import { ChevronRight, SkipForward } from 'lucide-react';

interface QuizNavigationProps {
  canProceed: boolean;
  canSkip: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onSkip: () => void;
}

export const QuizNavigation = ({
  canProceed,
  canSkip,
  isLastStep,
  onNext,
  onSkip,
}: QuizNavigationProps) => {
  return (
    <div className="flex items-center justify-between gap-4 w-full max-w-md mx-auto mt-8">
      {/* Skip Button */}
      <Button
        variant="ghost"
        onClick={onSkip}
        disabled={!canSkip}
        className="text-muted-foreground"
      >
        <SkipForward className="w-4 h-4 mr-1" />
        Skip
      </Button>

      {/* Next Button */}
      <Button
        onClick={onNext}
        disabled={!canProceed}
        className="flex-1 max-w-[200px]"
      >
        {isLastStep ? 'See My Results' : 'Next Scenario'}
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};
