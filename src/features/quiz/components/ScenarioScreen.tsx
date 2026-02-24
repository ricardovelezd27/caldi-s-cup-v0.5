import { QuizScenario, CoffeeTribe } from '../types/tribe';
import { VisualCard } from './VisualCard';
import { useLanguage } from '@/contexts/language';

interface ScenarioScreenProps {
  scenario: QuizScenario;
  selectedTribe: CoffeeTribe | undefined;
  onSelect: (tribe: CoffeeTribe) => void;
}

export const ScenarioScreen = ({ scenario, selectedTribe, onSelect }: ScenarioScreenProps) => {
  const { t } = useLanguage();
  const sId = scenario.id;
  const category = t(`quiz.cat${['Dining','Travel','HomeScreen','Gift','Coffee'][sId - 1]}`);
  const question = t(`quiz.q${sId}`);

  const optionKeys = ['A', 'B', 'C', 'D'] as const;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex justify-center mb-4">
        <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted rounded-full border border-border">
          {category}
        </span>
      </div>
      <h2 className="font-bangers text-2xl md:text-3xl lg:text-4xl text-foreground text-center mb-8 tracking-wide">
        {question}
      </h2>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {scenario.options.map((option, idx) => (
          <VisualCard
            key={option.id}
            id={option.id}
            label={t(`quiz.s${sId}o${optionKeys[idx]}`)}
            description={t(`quiz.s${sId}o${optionKeys[idx]}d`)}
            tribe={option.tribe}
            iconName={option.icon}
            isSelected={selectedTribe === option.tribe}
            onSelect={() => onSelect(option.tribe)}
          />
        ))}
      </div>
    </div>
  );
};
