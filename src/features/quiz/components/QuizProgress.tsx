import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language';

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const QuizProgress = ({ currentStep, totalSteps }: QuizProgressProps) => {
  const { t } = useLanguage();
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          {t('quiz.scenario')} {currentStep}/{totalSteps}
        </span>
        <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
      </div>
      <div className="h-3 bg-muted rounded-full border-2 border-border overflow-hidden">
        <div className={cn("h-full bg-primary transition-all duration-300 ease-out rounded-full")} style={{ width: `${progress}%` }} />
      </div>
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className={cn("w-2 h-2 rounded-full transition-colors", i + 1 <= currentStep ? "bg-primary" : "bg-muted-foreground/30")} />
        ))}
      </div>
    </div>
  );
};
