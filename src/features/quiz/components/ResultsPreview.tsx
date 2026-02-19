import { cn } from '@/lib/utils';
import { CoffeeTribe, QuizScores } from '../types/tribe';
import { TRIBES, TRIBE_ORDER } from '../data/tribes';
import { useLanguage } from '@/contexts/language';

interface ResultsPreviewProps {
  scores: QuizScores;
  percentages: Record<CoffeeTribe, number>;
  totalAnswered: number;
}

export const ResultsPreview = ({ scores, percentages, totalAnswered }: ResultsPreviewProps) => {
  const { t } = useLanguage();
  if (totalAnswered === 0) return null;

  const sortedTribes = [...TRIBE_ORDER].sort((a, b) => scores[b] - scores[a]);

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="bg-card border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))]">
        <h3 className="font-bangers text-lg text-foreground mb-3 tracking-wide">{t('quiz.resultsSoFar')}</h3>
        <div className="space-y-2">
          {sortedTribes.map((tribe) => {
            const tribeData = TRIBES[tribe];
            const percentage = percentages[tribe];
            const score = scores[tribe];
            return (
              <div key={tribe} className="flex items-center gap-3">
                <span className="text-xl w-8">{tribeData.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-foreground">{t(`tribes.${tribe}.name`)}</span>
                    <span className="text-xs text-muted-foreground">{score}/{totalAnswered} ({percentage}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-300", tribe === 'fox' && "bg-destructive", tribe === 'owl' && "bg-secondary", tribe === 'hummingbird' && "bg-primary", tribe === 'bee' && "bg-accent")} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
