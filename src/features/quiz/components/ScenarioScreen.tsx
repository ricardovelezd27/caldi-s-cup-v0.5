import { QuizScenario, CoffeeTribe } from '../types/tribe';
import { VisualCard } from './VisualCard';

interface ScenarioScreenProps {
  scenario: QuizScenario;
  selectedTribe: CoffeeTribe | undefined;
  onSelect: (tribe: CoffeeTribe) => void;
}

export const ScenarioScreen = ({ 
  scenario, 
  selectedTribe, 
  onSelect 
}: ScenarioScreenProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Category Badge */}
      <div className="flex justify-center mb-4">
        <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted rounded-full border border-border">
          {scenario.category}
        </span>
      </div>

      {/* Question */}
      <h2 className="font-bangers text-2xl md:text-3xl lg:text-4xl text-foreground text-center mb-8 tracking-wide">
        {scenario.question}
      </h2>

      {/* Visual Cards Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {scenario.options.map((option) => (
          <VisualCard
            key={option.id}
            id={option.id}
            label={option.label}
            description={option.description}
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
